import { createStyles, Theme, WithStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import React, { ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { interval, timer } from "rxjs";
import { filter, mergeMap, retry, take } from "rxjs/operators";
import api from "../../api";
import { getErrorMsg } from "../../common/utils/errorUtil";
import PageCircularProgress from "../../common/components/data-display/loader/PageLoader";
import { Path } from "../../router/Path";
import DashboardContent, { DashboardContentState } from "../DashboardContent";
import ViewDisabled from "../ViewDisabled";
import OpenOrders from "./openOrders/OpenOrders";
import OrderBook from "./orderBook/OrderBook";
import Select from "../../common/components/input/Select";
import PlaceOrder from "./placeOrder/PlaceOrder";
import ErrorMessage from "../../common/components/data-display/ErrorMessage";
import { useTradeStore } from "../../stores/tradeStore";
import { OrderType } from "../../enums";
import { Provider } from "mobx-react";

type PropsType = RouteComponentProps<{ param1: string }> &
  WithStyles<typeof styles>;

type StateType = DashboardContentState & {
  pairs: string[] | undefined;
  activePair: string | undefined;
  error: string;
};

const styles = (theme: Theme) => {
  return createStyles({
    container: {
      height: "100%",
    },
    wrapper: {
      height: "100%",
    },
    pairSelect: {
      paddingLeft: theme.spacing(2),
    },
    content: {
      flex: 1,
      overflowY: "auto",
      marginTop: theme.spacing(2),
    },
    orderItem: {
      flex: 2,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    openOrders: {
      flexWrap: "nowrap",
      overflowY: "auto",
      padding: theme.spacing(2),
    },
  });
};

class Trade extends DashboardContent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      pairs: undefined,
      error: "",
      activePair: undefined,
    };
  }

  tradeStore = useTradeStore({
    isBuyActive: true,
    openBuyOrders: [],
    openSellOrders: [],
    orderType: OrderType.LIMIT,
    price: "",
    amount: "",
    total: "",
    sliderValue: 0,
  });

  componentDidMount(): void {
    this.subs.add(
      timer(0, 2000)
        .pipe(
          mergeMap(() => super.checkStatus()),
          filter(
            () => !this.state.opendexdLocked && !this.state.opendexdNotReady
          ),
          take(1),
          mergeMap(() => api.listpairs$()),
          retry(10)
        )
        .subscribe({
          next: (resp) => {
            const activePair = "ETH/BTC";
            this.tradeStore.setActivePair(activePair);
            this.setState({
              initialLoadCompleted: true,
              pairs: resp.pairs,
              activePair,
            });
          },
          error: (err) =>
            this.setState({
              initialLoadCompleted: true,
              error: getErrorMsg(err),
            }),
        })
    );
    this.subs.add(
      interval(5000)
        .pipe(
          mergeMap(() => super.checkStatus()),
          retry(2)
        )
        .subscribe({
          error: () =>
            this.props.history.push({
              pathname: Path.CONNECTION_FAILED,
            }),
        })
    );
  }

  render(): ReactElement {
    const { error, pairs, activePair } = this.state;
    const { classes } = this.props;

    return (
      <Provider tradeStore={this.tradeStore}>
        <Grid container direction="column" className={classes.container}>
          {this.state.opendexdLocked || this.state.opendexdNotReady ? (
            <ViewDisabled
              opendexdLocked={this.state.opendexdLocked}
              opendexdStatus={this.state.opendexdStatus}
            />
          ) : (
            <Grid
              container
              direction="column"
              wrap="nowrap"
              className={classes.wrapper}
            >
              {pairs?.length ? (
                <>
                  <Grid item container className={classes.pairSelect}>
                    <Select
                      value={activePair}
                      name="tradingpair"
                      onChange={(newValue) => {
                        this.setState({ activePair: newValue });
                        this.tradeStore.setActivePair(newValue);
                      }}
                      options={pairs}
                    />
                  </Grid>
                  <Grid
                    item
                    container
                    spacing={2}
                    wrap="nowrap"
                    className={classes.content}
                  >
                    <Grid item container direction="column" xs={5}>
                      <OrderBook />
                    </Grid>
                    <Grid
                      item
                      container
                      direction="column"
                      wrap="nowrap"
                      xs={7}
                    >
                      <Grid item container className={classes.orderItem}>
                        <PlaceOrder />
                      </Grid>
                      <Grid
                        item
                        container
                        className={classes.orderItem + " " + classes.openOrders}
                      >
                        <OpenOrders />
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ) : this.state.initialLoadCompleted ? (
                <Grid item container justify="center">
                  <ErrorMessage
                    mainMessage="Error"
                    details={error || "No trading pairs found"}
                  />
                </Grid>
              ) : (
                <PageCircularProgress />
              )}
            </Grid>
          )}
        </Grid>
      </Provider>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Trade));
