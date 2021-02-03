import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  EMPTY,
  Observable,
  of,
  PartialObserver,
  Subscription,
  timer,
} from "rxjs";
import { exhaustMap } from "rxjs/operators";
import api from "../api";
import { isOpendexdLocked, isOpendexdReady } from "../common/serviceUtil";
import { Status } from "../models/Status";
import { Path } from "../router/Path";

export type RefreshableData<T, S> = {
  queryFn: (serviceName?: string) => Observable<T>;
  stateProp: keyof S;
  onSuccessCb?: (value: T) => void;
  isStatusQuery?: boolean;
  doNotSetInitialLoadCompleted?: boolean;
};

export type DashboardContentState = {
  opendexdLocked?: boolean;
  opendexdNotReady?: boolean;
  opendexdStatus?: string;
  initialLoadCompleted?: boolean;
};

abstract class DashboardContent<
  P extends RouteComponentProps<{ param1: string }>,
  S extends DashboardContentState
> extends Component<P, S> {
  protected subs: Subscription = new Subscription();
  protected refreshableData: RefreshableData<any, S>[] = [];
  private dataRefreshTimer = timer(0, 5000);

  componentDidMount(): void {
    this.refreshableData.forEach((data) =>
      this.subs.add(this.updateState(data))
    );
  }

  componentWillUnmount(): void {
    this.subs.unsubscribe();
  }

  updateState<T>(data: RefreshableData<T, S>): Subscription {
    return this.dataRefreshTimer
      .pipe(
        exhaustMap(() => this.checkStatus()),
        exhaustMap(() =>
          (this.state.opendexdLocked || this.state.opendexdNotReady) &&
          !data.isStatusQuery
            ? EMPTY
            : data.queryFn()
        )
      )
      .subscribe(
        this.handleResponse(
          data.stateProp,
          !!data.isStatusQuery,
          data.onSuccessCb,
          !data.doNotSetInitialLoadCompleted
        )
      );
  }

  checkStatus(): Observable<Status> {
    return api.statusByService$("opendexd").pipe(
      exhaustMap((resp: Status) => {
        this.setState({
          opendexdLocked: isOpendexdLocked(resp),
          opendexdNotReady: !isOpendexdReady(resp),
          opendexdStatus: resp.status,
        });
        return of(resp);
      })
    );
  }

  handleResponse<T>(
    stateProp: keyof S,
    isStatusQuery: boolean,
    onSuccessCb?: (value: T) => void,
    setInitialLoadCompleted = true
  ): PartialObserver<T> {
    return {
      next: (data: T) => {
        if (
          (!this.state.opendexdLocked && !this.state.opendexdNotReady) ||
          isStatusQuery
        ) {
          this.setState({ [stateProp]: data } as any);
          if (!this.state.initialLoadCompleted && setInitialLoadCompleted) {
            this.setState({ initialLoadCompleted: true });
          }

          if (onSuccessCb) {
            onSuccessCb(data);
          }
        }
      },
      error: () =>
        this.props.history.push({
          pathname: Path.CONNECTION_FAILED,
        }),
    };
  }
}

export default DashboardContent;
