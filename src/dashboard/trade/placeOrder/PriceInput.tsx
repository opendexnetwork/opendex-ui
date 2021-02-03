import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import NumberInput from "../../../common/NumberInput";
import { OrderType } from "../../../enums";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";
import { isMarketOrder } from "../tradeUtil";

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
            <FormControl variant="outlined" fullWidth>
              <Select
                id="type"
                value={tradeStore!.orderType}
                onChange={(event) => {
                  tradeStore!.setOrderType(event.target.value as OrderType);
                  onOrderTypeChange();
                }}
              >
                {orderTypeOpts.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="price">Price</InputLabel>
              <OutlinedInput
                id="price"
                labelWidth={40}
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
                inputComponent={
                  !isMarketOrder(tradeStore!.orderType)
                    ? (NumberInput as any)
                    : undefined
                }
                inputProps={
                  !isMarketOrder(tradeStore!.orderType)
                    ? { decimalScale: 8 }
                    : undefined
                }
                endAdornment={
                  <InputAdornment position="end">
                    {tradeStore!.quoteAsset}
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      );
    }
  )
);

export default PriceInput;
