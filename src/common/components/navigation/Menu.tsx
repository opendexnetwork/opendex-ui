import React from "react";
import Drawer from "@material-ui/core/Drawer";
import { Grid, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import CachedIcon from "@material-ui/icons/Cached";
import HistoryIcon from "@material-ui/icons/History";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Path } from "../../../router/Path";
import MenuItem, { MenuItemProps } from "./MenuItem";
import Overview from "../../../dashboard/overview/Overview";
import Trade from "../../../dashboard/trade/Trade";
import Tradehistory from "../../../dashboard/tradehistory/Tradehistory";
import Wallets from "../../../dashboard/wallet/Wallets";
import Console from "../../../dashboard/console/Console";
import { isElectron, sendMessageToParent } from "../../utils/appUtil";
import Button from "../input/buttons/Button";
import Settings from "../../../settings/Settings";

export const menuItems: MenuItemProps[] = [
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
  })
);

export interface MenuProps {
  syncInProgress: boolean;
  menuItemTooltipMsg: string[];
}

export const Menu: React.FunctionComponent<MenuProps> = (props) => {
  const classes = useStyles();

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
              isDisabled={item.path !== Path.OVERVIEW && props.syncInProgress}
              tooltipTextRows={props.menuItemTooltipMsg}
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
  );
};
