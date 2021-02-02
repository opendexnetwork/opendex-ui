import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Path } from "../router/Path";
import { isElectron, sendMessageToParent } from "./appUtil";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "100vh",
      padding: theme.spacing(3),
    },
    row: {
      padding: theme.spacing(3),
    },
  })
);

const ConnectionFailed = (): ReactElement => {
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    if (isElectron()) {
      sendMessageToParent("connectionFailed");
    }
  }, []);

  return (
    <Grid
      item
      container
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.container}
    >
      <Grid item className={classes.row}>
        <Typography variant="h6" component="h2">
          Failed to get data
        </Typography>
      </Grid>
      <Grid item className={classes.row}>
        <Button variant="outlined" onClick={() => history.push(Path.DASHBOARD)}>
          Try again
        </Button>
      </Grid>
    </Grid>
  );
};

export default ConnectionFailed;
