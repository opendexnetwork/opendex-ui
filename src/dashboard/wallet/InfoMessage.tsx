import {
  Card,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ReactElement } from "react";

type InfoMessageProps = {
  message: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      backgroundColor: theme.palette.info.main,
      color: theme.palette.info.contrastText,
      marginTop: theme.spacing(3),
      padding: theme.spacing(1),
      width: "100%",
    },
  })
);

const InfoMessage = (props: InfoMessageProps): ReactElement => {
  const { message } = props;
  const classes = useStyles();

  return (
    <Card elevation={0} className={classes.card}>
      <Typography variant="body2" align="center">
        {message}
      </Typography>
    </Card>
  );
};

export default InfoMessage;
