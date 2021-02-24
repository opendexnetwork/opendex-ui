import { Grid, InputAdornment } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import Select from "../../../common/components/input/select/Select";
import { OrderType } from "../../../enums";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";
import { isMarketOrder } from "../tradeUtil";
import NumberField from "../../../common/components/input/text/NumberField";

type PriceInputProps = {
  onOrderTypeChange: () => void;
  onPriceChange: () => void;
  className?: string;
  tradeStore?: TradeStore;
};

const PriceInput = inject(TRADE_STORE)(
  observer(
    (props: PriceInputProps): ReactElement => {
      const { onOrderTypeChange, onPriceChange, className, tradeStore } = props;

      const orderTypeOpts: { value: OrderType; text: string }[] = [
        { value: OrderType.LIMIT, text: "Limit" },
        { value: OrderType.MARKET, text: "Market" },
      ];

      return (
        <Grid
          item
          container
          alignItems="center"
          wrap="nowrap"
          spacing={2}
          className={className}
        >
          <Grid item xs={6}>
            <Select
              id="type"
              value={tradeStore!.orderType}
              onChange={(event) => {
                tradeStore!.setOrderType(event.target.value as OrderType);
                onOrderTypeChange();
              }}
              options={orderTypeOpts}
            />
          </Grid>
          <Grid item xs={6}>
            <NumberField
              fullWidth
              id="price"
              label="Price"
              value={
                isMarketOrder(tradeStore!.orderType)
                  ? "Market"
                  : tradeStore!.price
              }
              disabled={isMarketOrder(tradeStore!.orderType)}
              onChange={(event) => {
                tradeStore!.setPrice(event.target.value);
                onPriceChange();
              }}
              useTextInput={isMarketOrder(tradeStore!.orderType)}
              decimalScale={8}
              endAdornment={
                <InputAdornment position="end">
                  {tradeStore!.quoteAsset}
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>
      );
    }
  )
);

export default PriceInput;
