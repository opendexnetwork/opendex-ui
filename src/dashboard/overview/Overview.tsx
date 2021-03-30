import { createStyles, withStyles, WithStyles, Icon } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import { withRouter } from "react-router-dom";
import api from "../../api";
import PageLoader from "../../common/components/data-display/loader/PageLoader";
import { Status } from "../../models/Status";
import DashboardContent, {
  DashboardContentProps,
  DashboardContentState,
} from "../DashboardContent";
import OverviewItem from "./OverviewItem";
import { notificationIcon } from "../../common/utils/svgIcons";

type PropsType = DashboardContentProps & WithStyles<typeof styles>;

type StateType = DashboardContentState & {
  statuses?: Status[];
};

const styles = () => {
  return createStyles({
    wrapper: {
      overflowY: "auto",
    },
    headingContainer: {
      display: "flex",
      alignItems: "center",
    },
    heading: {
      fontSize: "30px",
      fontWeight: 500,
    },
    notificationIconContainer: {
      marginLeft: "auto",
    },
    notificationIcon: {
      cursor: "pointer",
    },
  });
};

@inject((stores) => ({
  serviceStore: (stores as any).serviceStore,
}))
@observer
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

  handleSelectNotifications = () => {
    console.log("handleSelectNotifications");
  };

  render(): ReactElement {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.headingContainer}>
          <h1 className={classes.heading}>Overview</h1>
          <Icon
            onClick={() => this.handleSelectNotifications()}
            className={classes.notificationIconContainer}
          >
            <img
              src={notificationIcon}
              alt="notifications"
              className={classes.notificationIcon}
            />
          </Icon>
        </div>

        <Grid container spacing={2} className={classes.wrapper}>
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
                <Grid key={status.service} item xs={12} md={6} xl={4}>
                  <OverviewItem
                    status={status}
                    key={status.service}
                    opendexdLocked={this.state.opendexdLocked}
                    opendexdNotReady={this.state.opendexdNotReady}
                  ></OverviewItem>
                </Grid>
              ))
          ) : (
            <PageLoader />
          )}
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Overview));
