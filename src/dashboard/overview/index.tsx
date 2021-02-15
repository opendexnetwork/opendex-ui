import { createStyles, withStyles, WithStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import api from "../../api";
import PageCircularProgress from "../../common/pageCircularProgress";
import { Status } from "../../models/Status";
import DashboardContent, { DashboardContentState } from "../DashboardContent";
import OverviewItem from "./overviewItem";

type PropsType = RouteComponentProps<{ param1: string }> &
  WithStyles<typeof styles>;

type StateType = DashboardContentState & {
  statuses?: Status[];
};

const styles = () => {
  return createStyles({
    wrapper: {
      overflowY: "auto",
    },
  });
};

class Overview extends DashboardContent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { statuses: undefined };
    this.refreshableData.push({
      queryFn: api.status$,
      stateProp: "statuses",
      isStatusQuery: true,
    });
  }

  sortingOrderByService = (service: string): number => {
    if (service === "opendexd") {
      return 0;
    }
    if (["lndbtc", "lndltc", "connext"].includes(service)) {
      return 1;
    }
    if (["bitcoind", "litecoind", "geth"].includes(service)) {
      return 2;
    }
    return 3;
  };

  statusFilter = (status: Status): boolean => {
    return status.status !== "Disabled";
  };

  render(): ReactElement {
    const { classes } = this.props;

    return (
      <Grid container spacing={5} className={classes.wrapper}>
        {this.state.initialLoadCompleted ? (
          this.state.statuses &&
          this.state.statuses
            .filter(this.statusFilter)
            .sort(
              (a, b) =>
                this.sortingOrderByService(a.service) -
                this.sortingOrderByService(b.service)
            )
            .map((status) => (
              <OverviewItem
                status={status}
                key={status.service}
                opendexdLocked={this.state.opendexdLocked}
                opendexdNotReady={this.state.opendexdNotReady}
              ></OverviewItem>
            ))
        ) : (
          <PageCircularProgress />
        )}
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Overview));
