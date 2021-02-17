import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import NumberInput from "../../../common/components/input/NumberInput";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";

type AmountInputProps = {
  onAmountChange: () => void;
  className?: string;
  tradeStore?: TradeStore;
};

const AmountInput = inject(TRADE_STORE)(
  observer(
    (props: AmountInputProps): ReactElement => {
      const { tradeStore, onAmountChange, className } = props;
      const showError = !tradeStore!.isAmountValid;

      const errorMessage = (): string => {
        return `Tradable ${tradeStore!.baseAsset} amount is insufficient`;
      };

      return (
        <FormControl variant="outlined" fullWidth className={className}>
          <InputLabel htmlFor="amount">Amount</InputLabel>
          <OutlinedInput
            error={showError}
            labelWidth={60}
            value={tradeStore!.amount}
            onChange={(event) => {
              tradeStore!.setAmount(event.target.value);
              onAmountChange();
            }}
            inputComponent={NumberInput as any}
            inputProps={{ decimalScale: 8 }}
            endAdornment={
              <InputAdornment position="end">
                {tradeStore!.baseAsset}
              </InputAdornment>
            }
          />
          <FormHelperText>{showError && errorMessage()}</FormHelperText>
        </FormControl>
      );
    }
  )
);

export default AmountInput;
