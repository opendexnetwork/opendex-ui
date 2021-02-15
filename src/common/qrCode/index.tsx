import {
  Grid,
  IconButton,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import QRCode from "qrcode.react";
import React, { ReactElement } from "react";

//styles
import { Container } from "./styles";

type QrCodeProps = {
  value: string;
  handleClose: () => void;
  size?: number;
};

const QrCode = (props: QrCodeProps): ReactElement => {
  const { value, handleClose, size } = props;
  return (
    <Container>
      <Grid item container justify="flex-end">
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Grid>
      <Grid item container justify="center" alignItems="center">
        <Typography component="div" align="center">
          <QRCode value={value} size={size || 150}></QRCode>
        </Typography>
      </Grid>
    </Container>
  );
};

export default QrCode;
