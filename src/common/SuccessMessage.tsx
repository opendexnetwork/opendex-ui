import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import React, { ReactElement } from "react";

type SuccessMessageProps = {
  message: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    successIcon: {
      color: theme.palette.success.main,
    },
  })
);

const SuccessMessage = (props: SuccessMessageProps): ReactElement => {
  const { message } = props;
  const classes = useStyles();

  return (
    <Grid item container spacing={1} alignItems="center" justify="center">
      <Grid item>
        <CheckIcon className={classes.successIcon} />
      </Grid>
      <Grid item>
        <Typography variant="body1" color="textPrimary" align="center">
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default SuccessMessage;
