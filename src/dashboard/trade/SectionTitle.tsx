import {
  createStyles,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
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
  });
});

const SectionTitle = (props: SectionTitleProps): ReactElement => {
  const classes = useStyles();

  return (
    <Grid
      item
      container
      justify="center"
      alignItems="center"
      wrap="nowrap"
      spacing={1}
    >
      <Grid item>
        <Typography component="h2" variant="overline" align="center">
          {props.title}
        </Typography>
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
