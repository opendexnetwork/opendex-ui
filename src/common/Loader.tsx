import {
  CircularProgress,
  createStyles,
  Grid,
  makeStyles,
} from "@material-ui/core";
import React, { ReactElement } from "react";

const useStyles = makeStyles(() =>
  createStyles({
    loaderContainer: {
      height: "100px",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

const Loader = (): ReactElement => {
  const classes = useStyles();

  return (
    <Grid container className={classes.loaderContainer}>
      <CircularProgress color="inherit" />
    </Grid>
  );
};

export default Loader;
