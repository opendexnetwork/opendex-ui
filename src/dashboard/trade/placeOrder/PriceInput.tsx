import { InputAdornment } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";
import { isMarketOrder } from "../tradeUtil";
import NumberField from "../../../common/components/input/text/NumberField";

type PriceInputProps = {
  onPriceChange: () => void;
  className?: string;
  InputAdornmentClass?: string;
  tradeStore?: TradeStore;
};

const PriceInput = inject(TRADE_STORE)(
  observer(
    (props: PriceInputProps): ReactElement => {
      const {
        onPriceChange,
        className,
        tradeStore,
        InputAdornmentClass,
      } = props;

      return (
        <NumberField
          className={className}
          fullWidth
          id="price"
          label="Price"
          value={
            isMarketOrder(tradeStore!.orderType) ? "Market" : tradeStore!.price
          }
          disabled={isMarketOrder(tradeStore!.orderType)}
          onChange={(event) => {
            tradeStore!.setPrice(event.target.value);
            onPriceChange();
          }}
          useTextInput={isMarketOrder(tradeStore!.orderType)}
          decimalScale={8}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <p className={InputAdornmentClass}>{tradeStore!.quoteAsset}</p>
              </InputAdornment>
            ),
          }}
        />
      );
    }
  )
);

export default PriceInput;
