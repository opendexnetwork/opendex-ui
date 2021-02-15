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
import { isXudLocked, isXudReady } from "../common/serviceUtil";
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
  xudLocked?: boolean;
  xudNotReady?: boolean;
  xudStatus?: string;
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
          (this.state.xudLocked || this.state.xudNotReady) &&
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
    return api.statusByService$("xud").pipe(
      exhaustMap((resp: Status) => {
        this.setState({
          xudLocked: isXudLocked(resp),
          xudNotReady: !isXudReady(resp),
          xudStatus: resp.status,
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
          (!this.state.xudLocked && !this.state.xudNotReady) ||
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
