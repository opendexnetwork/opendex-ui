import React from "react";
import { storiesOf } from "@storybook/react";
import { Provider } from "mobx-react";
import PlaceOrderContent from "../dashboard/trade/placeOrder/PlaceOrderContent";
import { useTradeStore } from "../stores/tradeStore";
import { OrderType } from "../enums";

const tradeStore = useTradeStore({
  activePair: "ETH/BTC",
  isBuyActive: true,
  openBuyOrders: [],
  openSellOrders: [],
  orderType: OrderType.MARKET,
  price: "0",
  amount: "0",
  total: "0",
  sliderValue: 0,
  baseAssetChannelBalance: 0,
  quoteAssetChannelBalance: 0,
  baseAssetLimits: {
    max_sell: "0",
    max_buy: "0",
    reserved_buy: "0",
    reserved_sell: "0",
  },
  quoteAssetLimits: {
    max_sell: "0",
    max_buy: "0",
    reserved_buy: "0",
    reserved_sell: "0",
  },
  currentBuyMarketPrice: 0,
  currentSellMarketPrice: 0,
});

storiesOf("PlaceOrder", module).add("PlaceOrderContentDefault", () => (
  <Provider tradeStore={tradeStore}>
    <PlaceOrderContent
      initialLoadCompleted={true}
      loadingErrors={""}
      resetMetaData={() => {}}
      resetFormData={() => {}}
      setOrderError={() => {}}
      orderError={""}
      tradeStore={tradeStore}
    />
  </Provider>
));
