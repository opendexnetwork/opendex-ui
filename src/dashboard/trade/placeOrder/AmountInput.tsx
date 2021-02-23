import { InputAdornment } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import NumberField from "../../../common/components/input/text/NumberField";
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
        <NumberField
          fullWidth
          id="amount"
          label="Amount"
          value={tradeStore!.amount}
          onChange={(event) => {
            tradeStore!.setAmount(event.target.value);
            onAmountChange();
          }}
          error={showError}
          helperText={showError && errorMessage()}
          endAdornment={
            <InputAdornment position="end">
              {tradeStore!.baseAsset}
            </InputAdornment>
          }
          decimalScale={8}
          className={className}
        />
      );
    }
  )
);

export default AmountInput;
