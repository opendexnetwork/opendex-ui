import { Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { ReactElement, useEffect, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { interval, timer } from "rxjs";
import {
  exhaustMap,
  filter,
  map,
  mergeMap,
  retry,
  takeUntil,
} from "rxjs/operators";
import api from "../api";
import NotFound from "../common/components/NotFound";
import { SetupStatusResponse } from "../models/SetupStatusResponse";
import { Status } from "../models/Status";
import { Path } from "../router/Path";
import Settings from "../settings/Settings";
import SetupWarning from "./SetupWarning";
import { isOpendexdReady } from "../common/utils/serviceUtil";
import { ServiceStore, SERVICE_STORE } from "../stores/serviceStore";
import { inject, observer } from "mobx-react";
import { Menu, menuItems } from "../common/components/navigation/Menu";

type DashboardProps = {
  serviceStore?: ServiceStore;
};

export const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      marginLeft: drawerWidth,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    },
  })
);

const Dashboard = inject(SERVICE_STORE)(
  observer(
    (props: DashboardProps): ReactElement => {
      const { serviceStore } = props;
      const classes = useStyles();
      const history = useHistory();
      const { path } = useRouteMatch();
      const { pathname } = useLocation();
      const [syncInProgress, setSyncInProgress] = useState(false);
      const [opendexdReady, setOpendexdReady] = useState(false);
      const [menuItemTooltipMsg, setMenuItemTooltipMsg] = useState<string[]>(
        []
      );

      useEffect(() => {
        if (syncInProgress) {
          return;
        }
        const statusSub = timer(0, 3000)
          .pipe(
            exhaustMap(() => api.statusByService$("opendexd")),
            retry(3)
          )
          .subscribe({
            next: (status) => {
              setOpendexdReady(isOpendexdReady(status));
              serviceStore!.setOpendexdStatus(status);
            },
            error: () => {
              setOpendexdReady(false);
              serviceStore!.setOpendexdStatus({
                service: "opendexd",
                status: "Failed to get status for opendexd",
              });
              history.push(Path.CONNECTION_FAILED);
            },
          });
        return () => statusSub.unsubscribe();
      }, [syncInProgress, history, serviceStore]);

      useEffect(() => {
        const lndsReady$ = interval(5000).pipe(
          mergeMap(() => api.status$()),
          map((statuses: Status[]) => {
            const lndbtc = statuses
              .filter((status: Status) => status.service === "lndbtc")
              .map((status: Status) => status.status)[0];
            const lndltc = statuses
              .filter((status: Status) => status.service === "lndltc")
              .map((status: Status) => status.status)[0];
            return { lndbtc, lndltc };
          }),
          filter(({ lndbtc, lndltc }) => {
            return lndbtc.includes("Ready") && lndltc.includes("Ready");
          })
        );
        const setupStatusSubscription = api
          .setupStatus$()
          .pipe(takeUntil(lndsReady$))
          .subscribe({
            next: (status: SetupStatusResponse | null) => {
              if (status && status.details) {
                setSyncInProgress(true);
                setMenuItemTooltipMsg([
                  "Waiting for initial sync...",
                  `Bitcoin: ${status.details["lndbtc"]}`,
                  `Litecoin: ${status.details["lndltc"]}`,
                ]);
              } else {
                setSyncInProgress(false);
              }
            },
            error: () => {
              history.push(Path.CONNECTION_FAILED);
            },
            complete: () => {
              setSyncInProgress(false);
              setMenuItemTooltipMsg([]);
            },
          });
        return () => setupStatusSubscription.unsubscribe();
      }, [history]);

      return (
        <Box>
          <Menu
            syncInProgress={syncInProgress}
            menuItemTooltipMsg={menuItemTooltipMsg}
          />
          <main className={classes.content}>
            <Grid item container>
              {opendexdReady &&
                !pathname.startsWith(`${path}${Path.SETTINGS}`) && (
                  <SetupWarning />
                )}
            </Grid>
            <Switch>
              {menuItems.map((item) => (
                <Route exact path={`${path}${item.path}`} key={item.text}>
                  {item.component}
                </Route>
              ))}
              <Route path={`${path}${Path.SETTINGS}`}>
                <Settings />
              </Route>
              <Route exact path={path}>
                <Redirect to={`${path}${Path.OVERVIEW}`} />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </main>
        </Box>
      );
    }
  )
);

export default Dashboard;
