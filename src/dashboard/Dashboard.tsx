import { Grid, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import CachedIcon from "@material-ui/icons/Cached";
import HistoryIcon from "@material-ui/icons/History";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
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
import Button from "../common/components/input/buttons/Button";
import MenuItem, {
  MenuItemProps,
} from "../common/components/navigation/MenuItem";
import NotFound from "../common/components/NotFound";
import { isElectron, sendMessageToParent } from "../common/utils/appUtil";
import { SetupStatusResponse } from "../models/SetupStatusResponse";
import { Status } from "../models/Status";
import { Path } from "../router/Path";
import Settings from "../settings/Settings";
import Console from "./console/Console";
import Overview from "./overview/Overview";
import SetupWarning from "./SetupWarning";
import Trade from "./trade/Trade";
import Tradehistory from "./tradehistory/Tradehistory";
import Wallets from "./wallet/Wallets";
import { isOpendexdReady } from "../common/utils/serviceUtil";
import { ServiceStore, SERVICE_STORE } from "../stores/serviceStore";
import { inject, observer } from "mobx-react";

type DashboardProps = {
  serviceStore?: ServiceStore;
};

export const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerPaper: {
      width: drawerWidth,
      justifyContent: "space-between",
    },
    menuContainer: {
      width: "100%",
    },
    header: {
      padding: "16px",
    },
    drawerButton: {
      margin: theme.spacing(2),
    },
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

      const menuItems: MenuItemProps[] = [
        {
          path: Path.OVERVIEW,
          text: "Overview",
          component: Overview,
          icon: RemoveRedEyeOutlinedIcon,
          isFallback: true,
        },
        {
          path: Path.TRADE,
          text: "Trade",
          component: Trade,
          icon: TrendingUpIcon,
        },
        {
          path: Path.TRADEHISTORY,
          text: "Trade History",
          component: Tradehistory,
          icon: HistoryIcon,
        },
        {
          path: Path.WALLETS,
          text: "Wallets",
          component: Wallets,
          icon: AccountBalanceWalletOutlinedIcon,
        },
        {
          path: Path.CONSOLE,
          text: "Console",
          component: Console,
          icon: SportsEsportsIcon,
        },
      ];

      const disconnect = (): void => {
        sendMessageToParent("disconnect");
      };

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
          <Drawer
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left"
          >
            <Grid container item>
              <Typography
                className={classes.header}
                variant="overline"
                component="p"
                color="textSecondary"
              >
                OpenDEX
              </Typography>
              <List className={classes.menuContainer}>
                {menuItems.map((item) => (
                  <MenuItem
                    path={item.path}
                    text={item.text}
                    component={item.component}
                    key={item.text}
                    icon={item.icon}
                    isFallback={item.isFallback}
                    isDisabled={item.path !== Path.OVERVIEW && syncInProgress}
                    tooltipTextRows={menuItemTooltipMsg}
                  />
                ))}
              </List>
            </Grid>
            <Grid container item direction="column" justify="flex-end">
              <Grid item container>
                <MenuItem
                  path={Path.SETTINGS}
                  text={"Settings"}
                  component={Settings}
                  icon={SettingsIcon}
                />
              </Grid>
              {isElectron() && (
                <Grid item container justify="center">
                  <Button
                    text="Disconnect"
                    tooltipTitle="Disconnect from opendex-docker"
                    tooltipPlacement="top"
                    size="small"
                    startIcon={<CachedIcon />}
                    variant="outlined"
                    className={classes.drawerButton}
                    fullWidth
                    onClick={disconnect}
                  />
                </Grid>
              )}
            </Grid>
          </Drawer>
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
