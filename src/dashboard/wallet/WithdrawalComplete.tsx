import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ReactElement } from "react";
import Button from "../../common/components/input/buttons/Button";
import { satsToCoinsStr } from "../../common/utils/currencyUtil";
import CheckBoltzTransactionStatus from "./CheckBoltzTransactionStatus";

type WithdrawalCompleteProps = {
  amount: number;
  address: string;
  currency: string;
  swapId: string;
  onClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      marginTop: theme.spacing(2),
    },
  })
);

const WithdrawalComplete = (props: WithdrawalCompleteProps): ReactElement => {
  const { amount, address, currency, swapId, onClose } = props;
  const classes = useStyles();

  return (
    <>
      <Grid item container alignItems="center" justify="center">
        <Typography variant="body2" component="div" align="center">
          Withdrawal of <strong>{satsToCoinsStr(amount, currency)}</strong> to{" "}
          <strong>{address}</strong> was successful!
        </Typography>
      </Grid>
      <Grid item container justify="center" className={classes.row}>
        <CheckBoltzTransactionStatus currency={currency} id={swapId} />
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        justify="center"
        className={classes.row}
      >
        <Button text="Close" color="primary" onClick={onClose} />
      </Grid>
    </>
  );
};

export default WithdrawalComplete;
