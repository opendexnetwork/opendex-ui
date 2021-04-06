import { createStyles, Grid, makeStyles, Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import React, { ReactElement } from "react";

type SectionTitleProps = {
  title: string;
  info?: string;
};

const useStyles = makeStyles(() => {
  return createStyles({
    iconContainer: {
      display: "flex",
      alignItems: "center",
    },
    sectionTitle: {
      color: "#f2f2f2",
      fontSize: "18px",
    },
  });
});

const SectionTitle = (props: SectionTitleProps): ReactElement => {
  const classes = useStyles();

  return (
    <Grid item>
      <Grid item>
        <h1 className={classes.sectionTitle}>{props.title}</h1>
      </Grid>

      {!!props.info && (
        <Grid item className={classes.iconContainer}>
          <Tooltip title={props.info}>
            <InfoIcon fontSize="inherit" />
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
};

export default SectionTitle;
