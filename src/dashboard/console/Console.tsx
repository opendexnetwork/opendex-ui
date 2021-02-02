import React, { Component, ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import api from "../../api";
import { combineLatest, fromEvent, Observable, Subscription } from "rxjs";
import { mergeMap, shareReplay, switchMap, take } from "rxjs/operators";
import {
  createStyles,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";

type PropsType = RouteComponentProps<{ param1: string }> &
  WithStyles<typeof styles> & {
    previousTerminal?: Terminal;
    setTerminal: (terminal: Terminal) => void;
  };

type StateType = {
  connected: boolean;
  id: string;
  consoleCreated: boolean;
  error?: string;
};

const styles = (theme: Theme) => {
  return createStyles({
    wrapper: {
      flex: 1,
    },
    title: {
      marginBottom: theme.spacing(2),
    },
    code: {
      backgroundColor: theme.palette.background.paper,
      padding: `0px ${theme.spacing(1)}px`,
      borderRadius: 5,
      letterSpacing: 2,
      fontFamily: "monospace",
    },
    terminalContainer: {
      height: "90%",
      width: "100%",
      overflowY: "auto",
    },
  });
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
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <Typography component="p" variant="body2" className={classes.title}>
          Type {<span className={classes.code}>help</span>} to show a list of
          available commands
        </Typography>
        {this.state.error && (
          <div>Error: {JSON.stringify(this.state.error)}</div>
        )}
        <div className={classes.terminalContainer} ref={this.ref} />
      </div>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Console));
