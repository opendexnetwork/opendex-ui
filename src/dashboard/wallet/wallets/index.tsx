import Grid from "@material-ui/core/Grid";
import React, { ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { timer } from "rxjs";
import { exhaustMap, shareReplay } from "rxjs/operators";
import api from "../../../api";
import PageCircularProgress from "../../../common/pageCircularProgress";
import { GetbalanceResponse } from "../../../models/GetbalanceResponse";
import { TradinglimitsResponse } from "../../../models/TradinglimitsResponse";
import DashboardContent, { DashboardContentState } from "../../DashboardContent";
import ViewDisabled from "../../viewDisabled";
import WalletItem from "../walletItem";

//styles
import { ItemsContainer } from "./styles";

type PropsType = RouteComponentProps<{ param1: string }>

type StateType = DashboardContentState & {
  balances: GetbalanceResponse | undefined;
  limits: TradinglimitsResponse | undefined;
};

class Wallets extends DashboardContent<PropsType, StateType> {
  getInfo$ = timer(0, 60000).pipe(
    exhaustMap(() => api.getinfo$()),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  getBoltzStatus$ = timer(0, 5000).pipe(
    exhaustMap(() => api.statusByService$("boltz")),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  constructor(props: PropsType) {
    super(props);
    this.state = { balances: undefined, limits: undefined };
    this.refreshableData.push(
      {
        queryFn: api.getbalance$,
        stateProp: "balances",
      },
      {
        queryFn: api.tradinglimits$,
        stateProp: "limits",
        doNotSetInitialLoadCompleted: true,
      }
    );
  }

  render(): ReactElement {
    const balances = this.state.balances?.balances;

    return (
      <Grid container direction="column">
        {this.state.opendexdLocked || this.state.opendexdNotReady ? (
          <ViewDisabled
            opendexdLocked={this.state.opendexdLocked}
            opendexdStatus={this.state.opendexdStatus}
          />
        ) : (
          <ItemsContainer container spacing={5}>
            {balances && Object.keys(balances).length ? (
              Object.keys(balances).map((currency) => (
                <WalletItem
                  key={currency}
                  currency={currency}
                  balance={balances![currency]}
                  getInfo$={this.getInfo$}
                  getBoltzStatus$={this.getBoltzStatus$}
                  limits={this.state.limits?.limits[currency]}
                ></WalletItem>
              ))
            ) : this.state.initialLoadCompleted ? (
              <Grid item container justify="center">
                No wallets found
              </Grid>
            ) : (
              <PageCircularProgress />
            )}
          </ItemsContainer>
        )}
      </Grid>
    );
  }
}

export default withRouter(Wallets);
