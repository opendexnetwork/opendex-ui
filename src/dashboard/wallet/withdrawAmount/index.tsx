import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import React, { ReactElement, useEffect, useState } from "react";
import {
  coinsToSats,
  satsToCoins,
  satsToCoinsStr,
} from "../../../common/currencyUtil";
import NumberInput from "../../../common/NumberInput";
import { GetServiceInfoResponse } from "../../../models/GetServiceInfoResponse";
import { getMaxWithdrawAmount, isAmountBetweenLimits } from "../walletUtil";

//styles
import { Row } from "./styles";

type WithdrawAmountProps = {
  currency: string;
  channelBalance: number;
  serviceInfo: GetServiceInfoResponse;
  onNext: (amount: number) => void;
  initialAmountInSats?: number;
};

const WithdrawAmount = (props: WithdrawAmountProps): ReactElement => {
  const {
    currency,
    channelBalance,
    serviceInfo,
    onNext,
    initialAmountInSats,
  } = props;
  const [amount, setAmount] = useState<string>("");
  const inputId = `withdraw-${currency}-amount`;

  useEffect(() => {
    setAmount(
      initialAmountInSats ? satsToCoins(initialAmountInSats).toString() : ""
    );
  }, [initialAmountInSats]);

  return (
    <>
      <FormControl variant="outlined">
        <InputLabel htmlFor={inputId}>Amount</InputLabel>
        <OutlinedInput
          id={inputId}
          labelWidth={60}
          value={amount || ""}
          onChange={(event) => {
            setAmount(event.target.value);
          }}
          inputComponent={NumberInput as any}
          inputProps={{ decimalScale: 8 }}
          endAdornment={
            <InputAdornment position="end">{currency}</InputAdornment>
          }
        />
      </FormControl>

      {channelBalance < Number(serviceInfo.limits.minimal) ? (
        <Row
          variant="body2"
          color="error"
          align="center"
        >
          Minimal withdrawal amount is{" "}
          <strong>
            {satsToCoinsStr(serviceInfo.limits.minimal, currency)}
          </strong>
          , your Layer 2 balance is{" "}
          <strong>{satsToCoinsStr(channelBalance, currency)}</strong>
        </Row>
      ) : (
        <Row variant="body2" align="center">
          Range: {<strong>{satsToCoinsStr(serviceInfo.limits.minimal)}</strong>}{" "}
          to{" "}
          {
            <strong>
              {satsToCoinsStr(
                getMaxWithdrawAmount(channelBalance, serviceInfo.limits),
                currency
              )}
            </strong>
          }
        </Row>
      )}
      <Button
        endIcon={<ArrowForwardIcon />}
        color="primary"
        disableElevation
        variant="contained"
        onClick={() => onNext(coinsToSats(amount))}
        disabled={
          isNaN(Number.parseFloat(amount)) ||
          !isAmountBetweenLimits(
            coinsToSats(amount),
            channelBalance,
            serviceInfo.limits
          )
        }
      >
        Next
      </Button>
    </>
  );
};

export default WithdrawAmount;
