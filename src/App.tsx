import CssBaseline from "@material-ui/core/CssBaseline";
import { Theme, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import React, { ReactElement, useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import ConnectionFailed from "./common/components/ConnectionFailed";
import NotFound from "./common/components/NotFound";
import Dashboard from "./dashboard/Dashboard";
import { Path } from "./router/Path";
import { darkTheme } from "./themes";
import { useElectronStore } from "./stores/electronStore";
import { Provider } from "mobx-react";
import {
  isElectron,
  logError,
  sendMessageToParent,
} from "./common/utils/appUtil";
import { useBackupStore } from "./stores/backupStore";
import api from "./api";
import { getErrorMsg } from "./common/utils/errorUtil";
import { timer } from "rxjs";
import { exhaustMap, retry } from "rxjs/operators";

const GlobalCss = withStyles((theme: Theme) => {
  const background = theme.palette.background;
  return {
    "@global": {
      "*": {
        "scrollbar-width": "thin",
        "scrollbar-color": `${background.paper} ${background.default}`,
      },
      "::-webkit-scrollbar": {
        width: 8,
      },
      "::-webkit-scrollbar-track": {
        background: background.default,
      },
      "::-webkit-scrollbar-thumb": {
        borderRadius: "4px",
        background: background.paper,
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: theme.palette.grey[700],
      },
      "::-webkit-scrollbar-corner": {
        backgroundColor: "transparent",
      },
    },
  };
})(() => null);

const electronStore = useElectronStore({});
const backupStore = useBackupStore({ backupInfoLoaded: false });

function App(): ReactElement {
  useEffect(() => {
    if (!isElectron()) {
      return;
    }
    sendMessageToParent("getConnectionType");
    const messageListenerHandler = (event: MessageEvent) => {
      if (event.data.startsWith("connectionType")) {
        electronStore.setConnectionType(
          event.data.substr(event.data.indexOf(":") + 2)
        );
      }
    };
    window.addEventListener("message", messageListenerHandler);
    return () => window.removeEventListener("message", messageListenerHandler);
  }, []);

  useEffect(() => {
    const sub = timer(0, 60000)
      .pipe(
        exhaustMap(() => api.getBackupInfo$()),
        retry(3)
      )
      .subscribe({
        next: (resp) => backupStore.setInfo(resp),
        error: (err) =>
          logError(`Failed to retrieve backup info: ${getErrorMsg(err)}`),
      });
    return () => sub.unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalCss />
      <Provider electronStore={electronStore} backupStore={backupStore}>
        <Router>
          <Switch>
            <Route path={Path.CONNECTION_FAILED}>
              <ConnectionFailed />
            </Route>
            <Route path={Path.DASHBOARD}>
              <Dashboard />
            </Route>
            <Route exact path={Path.HOME}>
              <Redirect to={Path.DASHBOARD} />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
