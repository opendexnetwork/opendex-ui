import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import React, { ReactElement } from "react";
import notFoundImg from "../../assets/404.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "100vh",
      padding: theme.spacing(3),
    },
  })
);
const NotFound = (): ReactElement => {
  const classes = useStyles();

  return (
    <Grid
      item
      container
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.container}
    >
      <img src={notFoundImg} alt="Page not found" />
    </Grid>
  );
};

export default NotFound;
