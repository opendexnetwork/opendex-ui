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
import { exhaustMap, retry } from "rxjs/operators";
import { Status } from "../models/Status";
import { Path } from "../router/Path";
import { ServiceStore } from "../stores/serviceStore";

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

export type DashboardContentProps = RouteComponentProps<{ param1: string }> & {
  serviceStore?: ServiceStore;
};

abstract class DashboardContent<
  P extends DashboardContentProps,
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
        ),
        retry(3)
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

  checkStatus(): Observable<Status | undefined> {
    const serviceStore = this.props.serviceStore!;
    this.setState({
      opendexdLocked: serviceStore.opendexdLocked,
      opendexdNotReady: !serviceStore.opendexdReady,
      opendexdStatus: serviceStore.opendexdStatus?.status,
    });
    return of(serviceStore.opendexdStatus);
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
