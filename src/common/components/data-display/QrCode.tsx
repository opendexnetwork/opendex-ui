import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import QRCode from "qrcode.react";
import React, { ReactElement } from "react";
import IconButton from "../input/buttons/IconButton";

type QrCodeProps = {
  value: string;
  handleClose: () => void;
  size?: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(2),
    },
    content: {
      height: "100%",
    },
  })
);

const QrCode = (props: QrCodeProps): ReactElement => {
  const classes = useStyles();
  const { value, handleClose, size } = props;
  return (
    <Paper className={classes.container}>
      <Grid item container justify="flex-end">
        <IconButton
          icon={<CloseIcon />}
          tooltipTitle="Close"
          onClick={handleClose}
        />
      </Grid>
      <Grid item container justify="center" alignItems="center">
        <Typography component="div" align="center">
          <QRCode value={value} size={size || 150}></QRCode>
        </Typography>
      </Grid>
    </Paper>
  );
};

export default QrCode;
