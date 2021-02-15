import {
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { ReactElement } from "react";
import { satsToCoinsStr } from "../../../common/currencyUtil";
import CheckBoltzTransactionStatus from "../checkBoltzStatus";

//styled
import { Row } from "./styles";

type WithdrawalCompleteProps = {
  amount: number;
  address: string;
  currency: string;
  swapId: string;
  onClose: () => void;
};

const WithdrawalComplete = (props: WithdrawalCompleteProps): ReactElement => {
  const { amount, address, currency, swapId, onClose } = props;

  return (
    <>
      <Grid item container alignItems="center" justify="center">
        <Typography variant="body2" component="div" align="center">
          Withdrawal of <strong>{satsToCoinsStr(amount, currency)}</strong> to{" "}
          <strong>{address}</strong> was successful!
        </Typography>
      </Grid>
      <Row item container justify="center">
        <CheckBoltzTransactionStatus currency={currency} id={swapId} />
      </Row>
      <Row
        item
        container
        alignItems="center"
        justify="center"
      >
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={onClose}
        >
          Close
        </Button>
      </Row>
    </>
  );
};

export default WithdrawalComplete;
