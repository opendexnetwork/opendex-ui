import { InputAdornment } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import NumberField from "../../../common/components/input/text/NumberField";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";

type TotalInputProps = {
  onTotalChange: () => void;
  className?: string;
  tradeStore?: TradeStore;
  InputAdornmentClass?: string;
};

const TotalInput = inject(TRADE_STORE)(
  observer(
    (props: TotalInputProps): ReactElement => {
      const {
        tradeStore,
        className,
        onTotalChange,
        InputAdornmentClass,
      } = props;

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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <p className={InputAdornmentClass}>{tradeStore!.quoteAsset}</p>
              </InputAdornment>
            ),
          }}
          decimalScale={8}
        />
      );
    }
  )
);

export default TotalInput;
