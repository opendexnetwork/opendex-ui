import { InputAdornment } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import NumberField from "../../../common/components/input/text/NumberField";
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
        <NumberField
          fullWidth
          className={className}
          id="total"
          label="Total"
          value={tradeStore!.total}
          onChange={(event) => {
            if (tradeStore!.total !== event.target.value) {
              tradeStore!.setTotal(event.target.value);
              onTotalChange();
            }
          }}
          error={showError}
          helperText={showError && errorMessage()}
          endAdornment={
            <InputAdornment position="end">
              {tradeStore!.quoteAsset}
            </InputAdornment>
          }
          decimalScale={8}
        />
      );
    }
  )
);

export default TotalInput;
