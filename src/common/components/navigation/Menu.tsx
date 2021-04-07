import React, { useEffect, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import { Grid } from "@material-ui/core";
import List from "@material-ui/core/List";
import CachedIcon from "@material-ui/icons/Cached";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation, useRouteMatch } from "react-router-dom";
import { Path } from "../../../router/Path";
import MenuItem, { MenuItemProps } from "./MenuItem";
import Overview from "../../../dashboard/overview/Overview";
import Trade from "../../../dashboard/trade/Trade";
import Tradehistory from "../../../dashboard/tradehistory/Tradehistory";
import Wallets from "../../../dashboard/wallet/Wallets";
import Console from "../../../dashboard/console/Console";
import Learn from "../../../dashboard/learn/Learn";
import { isElectron, sendMessageToParent } from "../../utils/appUtil";
import Button from "../input/buttons/Button";
import Settings from "../../../settings/Settings";
import { LearnIcon } from "../icons/LearnIcon";
import { OverviewIcon } from "../icons/OverviewIcon";
import { TradeIcon } from "../icons/TradeIcon";
import { TradeHistoryIcon } from "../icons/TradeHistoryIcon";
import { WalletIcon } from "../icons/WalletIcon";
import { ConsoleIcon } from "../icons/ConsoleIcon";
import { SettingsIcon } from "../icons/SettingsIcon";
import { OpenDexMainLogo } from "../icons/OpenDexMainLogo";

export const menuItems: MenuItemProps[] = [
  {
    path: Path.OVERVIEW,
    text: "Overview",
    component: Overview,
    icon: OverviewIcon,
    isFallback: true,
  },
  {
    path: Path.TRADE,
    text: "Trade",
    component: Trade,
    icon: TradeIcon,
  },
  {
    path: Path.TRADEHISTORY,
    text: "Trade History",
    component: Tradehistory,
    icon: TradeHistoryIcon,
  },
  {
    path: Path.WALLETS,
    text: "Wallets",
    component: Wallets,
    icon: WalletIcon,
  },
  {
    path: Path.CONSOLE,
    text: "Console",
    component: Console,
    icon: ConsoleIcon,
  },
  {
    path: Path.LEARN,
    text: "Learn",
    component: <Learn />,
    icon: LearnIcon,
  },
  {
    path: Path.SETTINGS,
    text: "Settings",
    component: <Settings />,
    icon: SettingsIcon,
  },
];

export const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: drawerWidth,
    justifyContent: "space-between",
    background: "linear-gradient(#101013, #1c2027, #1a1112, #171011)",
    border: "none",
  },
  menuContainer: {
    width: "100%",
    paddingLeft: "10px",
  },
  drawerButton: {
    margin: theme.spacing(2),
  },
  borderRadiusContainer: {
    height: "25px",
  },
  borderRadiusOfTopContainer: {
    borderRadius: "0px 0px 25px 0px",
    boxShadow: "25px 0px 0px #0c0c0c",
    transition: "box-shadow 0.1s ease",
  },
  borderRadiusOfBottomContainer: {
    borderRadius: "0px 25px 0px 0px",
    boxShadow: "25px 0px 0px #0c0c0c",
    transition: "box-shadow 0.1s ease",
  },
}));

export interface MenuProps {
  syncInProgress: boolean;
  menuItemTooltipMsg: string[];
}

export const Menu: React.FunctionComponent<MenuProps> = (props) => {
  const classes = useStyles();
  const { url } = useRouteMatch();
  const { pathname } = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSetSelectedIndex = () => {
    const activeItem = menuItems.findIndex(
      (item) =>
        pathname === `${url}${item.path}` ||
        pathname.startsWith(`${url}${item.path}/`)
    );
    setSelectedIndex(activeItem);
  };

  useEffect(() => {
    handleSetSelectedIndex();
  });

  const disconnect = (): void => {
    sendMessageToParent("disconnect");
  };

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <Grid container item>
        <OpenDexMainLogo />
        <List className={classes.menuContainer}>
          <div
            className={
              selectedIndex === 0
                ? `${classes.borderRadiusOfTopContainer} ${classes.borderRadiusContainer}`
                : classes.borderRadiusContainer
            }
          ></div>

          {menuItems.map((item, i) => (
            <MenuItem
              isBeforeSelected={i + 1 === selectedIndex && selectedIndex !== -1}
              isAfterSelected={i - 1 === selectedIndex && selectedIndex !== -1}
              selected={i === selectedIndex}
              path={item.path}
              text={item.text}
              component={item.component}
              key={item.text}
              icon={item.icon}
              isFallback={item.isFallback}
              isDisabled={item.path !== Path.OVERVIEW && props.syncInProgress}
              tooltipTextRows={props.menuItemTooltipMsg}
            />
          ))}
          <div
            className={
              selectedIndex === menuItems.length - 1
                ? `${classes.borderRadiusOfBottomContainer} ${classes.borderRadiusContainer}`
                : classes.borderRadiusContainer
            }
          ></div>
        </List>
      </Grid>
      <Grid container item direction="column" justify="flex-end">
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
  );
};
