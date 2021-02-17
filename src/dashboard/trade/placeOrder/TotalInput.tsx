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

type TotalInputProps = {
  onTotalChange: () => void;
  className?: string;
  tradeStore?: TradeStore;
};

const TotalInput = inject(TRADE_STORE)(
  observer(
    (props: TotalInputProps): ReactElement => {
      const { tradeStore, className, onTotalChange } = props;

      const showError = !tradeStore!.isTotalValid;

      const errorMessage = (): string => {
        return `Tradable ${tradeStore!.quoteAsset} amount is insufficient`;
      };

      return (
        <FormControl variant="outlined" fullWidth className={className}>
          <InputLabel htmlFor="total">Total</InputLabel>
          <OutlinedInput
            error={showError}
            labelWidth={40}
            value={tradeStore!.total}
            onChange={(event) => {
              if (tradeStore!.total !== event.target.value) {
                tradeStore!.setTotal(event.target.value);
                onTotalChange();
              }
            }}
            inputComponent={NumberInput as any}
            inputProps={{ decimalScale: 8 }}
            endAdornment={
              <InputAdornment position="end">
                {tradeStore!.quoteAsset}
              </InputAdornment>
            }
          />
          <FormHelperText>{showError && errorMessage()}</FormHelperText>
        </FormControl>
      );
    }
  )
);

export default TotalInput;
