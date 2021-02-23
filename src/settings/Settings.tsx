import {
  createStyles,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import {
  NavLink,
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import Loader from "../common/components/data-display/loader/Loader";
import { Path } from "../router/Path";
import { BackupStore, BACKUP_STORE } from "../stores/backupStore";
import BackupDirectory from "./BackupDirectory";
import ChangePassword from "./ChangePassword";
import Setup from "./Setup";
import api from "../api";
import { retry } from "rxjs/operators";
import { logError } from "../common/utils/appUtil";
import { getErrorMsg } from "../common/utils/errorUtil";

type SettingsProps = {
  backupStore?: BackupStore;
};

type MenuItem = {
  text: string;
  path: Path;
  component: ReactElement;
  isDisabled?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: "100%",
      width: "100%",
    },
    content: {
      height: "60%",
      width: "80%",
      maxHeight: "900px",
      maxWidth: "1500px",
      minHeight: "350px",
      minWidth: "600px",
    },
    menu: {
      width: "100%",
    },
    divider: {
      marginRight: theme.spacing(2),
    },
  })
);

const createMenuItems = (backupStore: BackupStore): MenuItem[] => {
  const initialSetupFinished =
    backupStore!.backupInfoLoaded &&
    !backupStore!.defaultPassword &&
    backupStore!.mnemonicShown &&
    !backupStore!.defaultBackupDirectory;

  return [
    {
      text: "Initial Setup",
      path: Path.INITIAL_SETUP,
      component: <Setup />,
      isDisabled: !backupStore!.backupInfoLoaded || initialSetupFinished,
    },
    {
      text: "Backup",
      path: Path.BACKUP,
      component: <BackupDirectory />,
      isDisabled: !initialSetupFinished,
    },
    {
      text: "Change Password",
      path: Path.CHANGE_PASSWORD,
      component: <ChangePassword />,
      isDisabled: !initialSetupFinished,
    },
  ];
};

const Settings = inject(BACKUP_STORE)(
  observer(
    (props?: SettingsProps): ReactElement => {
      const { backupStore } = props!;
      const classes = useStyles();
      const { path, url } = useRouteMatch();
      const { pathname } = useLocation();
      const [loadingInfo, setLoadingInfo] = useState(true);
      const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

      useEffect(() => {
        const sub = api
          .getBackupInfo$()
          .pipe(retry(3))
          .subscribe({
            next: (resp) => {
              backupStore!.setInfo(resp);
              setMenuItems(createMenuItems(backupStore!));
              setLoadingInfo(false);
            },
            error: (err) =>
              logError(`Failed to retrieve backup info: ${getErrorMsg(err)}`),
          });
        return () => sub.unsubscribe();
      }, [backupStore]);

      const firstEnabledMenuItem = menuItems.find((item) => !item.isDisabled);

      return (
        <Grid
          container
          alignItems="center"
          justify="center"
          className={classes.wrapper}
        >
          {loadingInfo ? (
            <Loader />
          ) : (
            <Grid item container className={classes.content}>
              <Grid
                item
                container
                direction="column"
                justify="center"
                alignItems="center"
                xs={4}
                lg={3}
              >
                <List className={classes.menu}>
                  {menuItems
                    .filter((item) => !item.isDisabled)
                    .map((item) => {
                      const navigateTo = `${url}${item.path}`;
                      return (
                        <ListItem
                          key={item.text}
                          button
                          component={NavLink}
                          to={navigateTo}
                          selected={navigateTo === pathname}
                        >
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{ variant: "overline" }}
                          />
                        </ListItem>
                      );
                    })}
                </List>
              </Grid>
              <Divider
                orientation="vertical"
                flexItem
                className={classes.divider}
              />
              <Grid
                item
                container
                alignItems="center"
                justify="space-between"
                xs={7}
                lg={8}
              >
                <Switch>
                  {menuItems
                    .filter((item) => !item.isDisabled)
                    .map((item) => {
                      return (
                        <Route
                          exact
                          path={`${path}${item.path}`}
                          key={item.text}
                        >
                          {item.component}
                        </Route>
                      );
                    })}
                  {!!firstEnabledMenuItem && (
                    <Route exact path={path}>
                      <Redirect to={`${path}${firstEnabledMenuItem?.path}`} />
                    </Route>
                  )}
                </Switch>
              </Grid>
            </Grid>
          )}
        </Grid>
      );
    }
  )
);

export default Settings;
