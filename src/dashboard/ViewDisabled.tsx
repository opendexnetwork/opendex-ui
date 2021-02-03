import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React, { ReactElement } from "react";
import UnlockOpendexd from "./UnlockOpendexd";

export type ViewDisabledProps = {
  opendexdLocked?: boolean;
  opendexdStatus?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      padding: theme.spacing(3),
    },
  })
);

function ViewDisabled(props: ViewDisabledProps): ReactElement {
  const classes = useStyles();
  const { opendexdLocked, opendexdStatus } = props;
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid
        container
        item
        alignItems="center"
        justify="center"
        spacing={2}
        className={classes.row}
      >
        <Grid item>
          <Grid item container alignItems="center">
            <ReportProblemOutlinedIcon fontSize="large" />
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h4" component="h1">
            {opendexdLocked ? "opendexd is locked" : "opendexd is not ready"}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item justify="center" className={classes.row}>
        {opendexdLocked ? (
          <UnlockOpendexd />
        ) : (
          <Grid item>
            <Typography variant="h6" component="h2">
              {opendexdStatus || ""}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ViewDisabled;
