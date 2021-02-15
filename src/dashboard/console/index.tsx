import React, { Component, ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import api from "../../api";
import { combineLatest, fromEvent, Observable, Subscription } from "rxjs";
import { mergeMap, shareReplay, switchMap, take } from "rxjs/operators";

//styles
import { 
  Wrapper,
  Title,
  Code,
  TerminalContainer
} from "./styles";

type PropsType = RouteComponentProps<{ param1: string }>

type StateType = {
  connected: boolean;
  id: string;
  consoleCreated: boolean;
  error?: string;
};

const consoleCreated$ = (api.sio.io$.pipe(
  mergeMap((io) => fromEvent(io, "created")),
  shareReplay({ refCount: true, bufferSize: 1 })
) as unknown) as Observable<string>;

const consoleOutput$ = consoleCreated$.pipe(
  mergeMap((id: string) => api.sio.console$(id))
);

const socket$ = combineLatest([consoleCreated$, api.sio.io$]);

class Console extends Component<PropsType, StateType> {
  ref: React.RefObject<HTMLDivElement>;

  term!: Terminal;

  socket!: SocketIOClient.Socket;

  fitAddon!: FitAddon;

  sub: Subscription = new Subscription();

  resizeListener = () => {
    this.fitAddon.fit();
  };

  constructor(props: PropsType) {
    super(props);

    this.state = {
      connected: false,
      id: "?",
      consoleCreated: false,
    };

    this.ref = React.createRef();

    // Bind methods
    this.onData = this.onData.bind(this);
    this.onResize = this.onResize.bind(this);

    this.setupTerminal();
  }

  setupTerminal() {
    this.term = new Terminal({
      fontSize: 16,
      fontFamily:
        "Menlo, Ubuntu Mono, Fira Code, Courier New, Courier, monospace",
    });

    const fitAddon = new FitAddon();
    this.fitAddon = fitAddon;
    this.term.loadAddon(fitAddon);

    this.term.onData(this.onData);
    this.term.onResize(this.onResize);
  }

  componentDidMount() {
    this.sub.add(this.addConnectionListener("connect"));
    this.sub.add(this.addConnectionListener("disconnect"));
    this.initializeTerminal();
    window.addEventListener("resize", this.resizeListener);
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
    this.term.dispose();
    window.removeEventListener("resize", this.resizeListener);
    api.sio.io$.pipe(take(1)).subscribe((io) => {
      io.emit(
        "stop",
        JSON.stringify({
          id: this.state.id,
        })
      );
    });
  }

  private addConnectionListener(event: "connect" | "disconnect") {
    this.sub.add(
      api.sio.io$
        .pipe(switchMap((io) => fromEvent(io, event)))
        .subscribe(() => {
          this.setState({ ...this.state, connected: event === "connect" });
        })
    );
  }

  private initializeTerminal() {
    if (this.ref.current) {
      this.term.open(this.ref.current);
      this.fitAddon.fit();

      this.createConsole();

      this.sub.add(
        consoleCreated$.subscribe((id) =>
          this.setState({
            ...this.state,
            id: id as string,
            consoleCreated: true,
          })
        )
      );

      this.sub.add(consoleOutput$.subscribe((data) => this.term.write(data)));

      this.sub.add(
        socket$.subscribe({
          next: ([id, socket]) => this.startConsole(id, socket),
          error: (error) => {
            this.setState({ ...this.state, error: error });
          },
        })
      );
    }
  }

  private createConsole() {
    this.sub.add(
      api.sio.io$.subscribe((io) => {
        if (!this.state.consoleCreated) {
          io.emit("create");
        }
      })
    );
  }

  private startConsole(id: string, socket: SocketIOClient.Socket) {
    const data = JSON.stringify({
      id,
      size: { rows: 25, cols: 80 },
    });
    socket.emit("start", data);
  }

  private onData(data: string) {
    api.sio.io$.subscribe((io) => {
      io.emit(`console.${this.state.id}.input`, data);
    });
  }

  private onResize(event: { cols: number; rows: number }) {
    this.fitAddon.fit();
    api.sio.io$.subscribe((io) => {
      io.emit(
        "resize",
        JSON.stringify({
          id: this.state.id,
          size: event,
        })
      );
    });
  }

  render(): ReactElement {
    return (
      <Wrapper>
        <Title component="p" variant="body2">
          Type {<Code>help</Code>} to show a list of
          available commands
        </Title>
        {this.state.error && (
          <div>Error: {JSON.stringify(this.state.error)}</div>
        )}
        <TerminalContainer ref={this.ref} />
      </Wrapper>
    );
  }
}

export default withRouter(Console);
