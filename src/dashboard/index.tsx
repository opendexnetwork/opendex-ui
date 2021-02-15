import { Box, Grid, Tooltip } from "@material-ui/core";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import CachedIcon from "@material-ui/icons/Cached";
import HistoryIcon from "@material-ui/icons/History";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import React, { ReactElement, useEffect, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { interval } from "rxjs";
import { filter, map, mergeMap, takeUntil } from "rxjs/operators";
import api from "../api";
import { isElectron, sendMessageToParent } from "../common/appUtil";
import NotFound from "../common/notFound";
import { SetupStatusResponse } from "../models/SetupStatusResponse";
import { Status } from "../models/Status";
import { Path } from "../router/Path";
import Console from "./console";
import MenuItem, { MenuItemProps } from "./menu/menuItem";
import Overview from "./overview";
// import SetupWarning from "./SetupWarning";
import Trade from "./trade/Trade";
import Tradehistory from "./tradehistory";
import Wallets from "./wallet/wallets";
/* import SettingsIcon from "@material-ui/icons/Settings";
import Settings from "../settings/Settings"; */

//styles
import {
  DrawerPaper,
  MenuContainer,
  Header,
  DrawerButton,
  Content
} from "./styles";

const Dashboard = (): ReactElement => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [menuItemTooltipMsg, setMenuItemTooltipMsg] = useState<string[]>([]);

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
          if (status) {
            setSyncInProgress(true);
            setMenuItemTooltipMsg(
              status.details
                ? [
                    "Waiting for initial sync...",
                    `Bitcoin: ${status.details["lndbtc"]}`,
                    `Litecoin: ${status.details["lndltc"]}`,
                  ]
                : [status.status]
            );
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
      <DrawerPaper
        variant="permanent"
        anchor="left"
      >
        <Grid container item>
          <Header
            variant="overline"
            component="p"
            color="textSecondary"
          >
            OPENDEXD UI
          </Header>
          <MenuContainer>
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
          </MenuContainer>
        </Grid>
        <Grid container item direction="column" justify="flex-end">
          {/* <Grid item container>
            <MenuItem
              path={Path.SETTINGS}
              text={"Settings"}
              component={Settings}
              icon={SettingsIcon}
            />
          </Grid> */}
          {isElectron() && (
            <Grid item container justify="center">
              <Tooltip title="Disconnect from opendex-docker" placement="top">
                <DrawerButton
                  size="small"
                  startIcon={<CachedIcon />}
                  variant="outlined"
                  onClick={disconnect}
                >
                  Disconnect
                </DrawerButton>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </DrawerPaper>
      <Content>
        {/* <Grid item container>
          {<SetupWarning />}
        </Grid> */}
        <Switch>
          {menuItems.map((item) => (
            <Route exact path={`${path}${item.path}`} key={item.text}>
              {item.component}
            </Route>
          ))}
          {/* <Route path={`${path}${Path.SETTINGS}`}>
            <Settings />
          </Route> */}
          <Route exact path={path}>
            <Redirect to={`${path}${Path.OVERVIEW}`} />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Content>
    </Box>
  );
};

export default Dashboard;
