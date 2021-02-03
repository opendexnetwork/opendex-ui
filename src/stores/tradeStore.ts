import { observable } from "mobx";
import { satsToCoins } from "../common/currencyUtil";
import {
  calculateProduct,
  getLimitForAsset,
  getBuyLimit,
  getSellLimit,
  calculateQuotient,
} from "../dashboard/trade/tradeUtil";
import { OrderType } from "../enums";
import { GetbalanceResponse } from "../models/GetbalanceResponse";
import { Order } from "../models/Order";
import { TradingLimits } from "../models/TradingLimits";
import { TradinglimitsResponse } from "../models/TradinglimitsResponse";

export type TradeInfo = {
  activePair?: string;
  isBuyActive: boolean;
  openBuyOrders: Order[];
  openSellOrders: Order[];
  orderType: OrderType;
  price: string;
  amount: string;
  total: string;
  sliderValue: number;
  baseAssetChannelBalance?: number;
  quoteAssetChannelBalance?: number;
  baseAssetLimits?: TradingLimits;
  quoteAssetLimits?: TradingLimits;
  currentBuyMarketPrice?: number;
  currentSellMarketPrice?: number;
};

export type TradeStore = ReturnType<typeof useTradeStore>;

export const TRADE_STORE = "tradeStore";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTradeStore = (defaultTradeInfo: TradeInfo) => {
  const store = observable({
    trade: defaultTradeInfo,
    get activePair(): string | undefined {
      return store.trade.activePair;
    },
    get baseAsset(): string | undefined {
      return store.trade.activePair?.split("/")[0];
    },
    get quoteAsset(): string | undefined {
      return store.trade.activePair?.split("/")[1];
    },
    setActivePair(value: string | undefined): void {
      store.trade.activePair = value;
    },
    get isBuyActive(): boolean {
      return store.trade.isBuyActive;
    },
    setIsBuyActive(value: boolean): void {
      store.trade.isBuyActive = value;
    },
    get currentBuyMarketPrice(): number | undefined {
      return store.trade.currentBuyMarketPrice;
    },
    setCurrentBuyMarketPrice(value: number | undefined): void {
      store.trade.currentBuyMarketPrice = value;
    },
    get currentSellMarketPrice(): number | undefined {
      return store.trade.currentSellMarketPrice;
    },
    setCurrentSellMarketPrice(value: number | undefined): void {
      store.trade.currentSellMarketPrice = value;
    },
    get openBuyOrders(): Order[] {
      return store.trade.openBuyOrders;
    },
    setOpenBuyOrders(value: Order[]): void {
      store.trade.openBuyOrders = value;
    },
    get openSellOrders(): Order[] {
      return store.trade.openSellOrders;
    },
    setOpenSellOrders(value: Order[]): void {
      store.trade.openSellOrders = value;
    },
    get orderType(): OrderType {
      return store.trade.orderType;
    },
    setOrderType(value: OrderType): void {
      store.trade.orderType = value;
    },
    get price(): string {
      return store.trade.price;
    },
    /**
     * The price is calculated by amount and total only if it is empty or 0
     * The amount is recalculated by user triggered price change only when it is empty or 0
     */
    setPrice(value: string, calculated?: boolean): void {
      if (
        calculated &&
        Number(store.trade.price) === 0 &&
        Number(store.trade.total) !== 0 &&
        Number(store.trade.amount) !== 0
      ) {
        store.trade.price = value;
      }
      if (!calculated) {
        store.trade.price = value;
        const amount = calculateQuotient(value, store.trade.total);
        if (Number(store.trade.amount) === 0 && Number(amount) !== 0) {
          store.setAmount(amount, true);
        }
        const total = calculateProduct(value, store.trade.amount);
        if (total && Number(total) !== 0) {
          store.setTotal(total, true);
        }
      }
    },
    get amount(): string {
      return store.trade.amount;
    },
    setAmount(value: string, calculated?: boolean): void {
      store.trade.amount = value;
      store.setSliderValue(
        value
          ? Math.min(
              100,
              Math.round((Number(value) * 100) / store.currentMaxAmount)
            )
          : 0
      );
      if (!calculated) {
        if (Number(store.trade.price) !== 0) {
          store.setTotal(calculateProduct(store.trade.price, value), true);
        }
        store.setPrice(calculateQuotient(value, store.trade.total), true);
      }
    },
    get total(): string {
      return store.trade.total;
    },
    setTotal(value: string, calculated?: boolean): void {
      store.trade.total = value;
      if (!calculated) {
        if (Number(store.trade.price) !== 0) {
          store.setAmount(calculateQuotient(store.trade.price, value), true);
        }
        store.setPrice(calculateQuotient(store.trade.amount, value), true);
      }
    },
    get sliderValue(): number {
      return store.trade.sliderValue;
    },
    setSliderValue(value: number): void {
      store.trade.sliderValue = value;
    },
    get baseAssetChannelBalance(): number | undefined {
      return store.trade.baseAssetChannelBalance;
    },
    get quoteAssetChannelBalance(): number | undefined {
      return store.trade.quoteAssetChannelBalance;
    },
    setChannelBalances(balances: GetbalanceResponse | undefined): void {
      const baseAssetBalance =
        balances?.balances[store.baseAsset!]?.channel_balance;
      store.trade.baseAssetChannelBalance = Number(baseAssetBalance);
      const quoteAssetBalance =
        balances?.balances[store.quoteAsset!]?.channel_balance;
      store.trade.quoteAssetChannelBalance = Number(quoteAssetBalance);
    },
    get baseAssetLimits(): TradingLimits | undefined {
      return store.trade.baseAssetLimits;
    },
    get quoteAssetLimits(): TradingLimits | undefined {
      return store.trade.quoteAssetLimits;
    },
    setTradingLimits(limits: TradinglimitsResponse | undefined): void {
      store.trade.baseAssetLimits = limits?.limits[store.baseAsset!];
      store.trade.quoteAssetLimits = limits?.limits[store.quoteAsset!];
    },
    get channelBalance(): number {
      return satsToCoins(
        store.trade.isBuyActive
          ? store.trade.quoteAssetChannelBalance!
          : store.trade.baseAssetChannelBalance!
      );
    },
    get sellLimit(): number {
      return satsToCoins(
        getSellLimit(
          store.trade.isBuyActive,
          store.trade.baseAssetLimits!,
          store.trade.quoteAssetLimits!
        )
      );
    },
    get buyLimit(): number {
      return satsToCoins(
        getBuyLimit(
          store.trade.isBuyActive,
          store.trade.baseAssetLimits!,
          store.trade.quoteAssetLimits!
        )
      );
    },
    get currentMaxAmount(): number {
      const limit = getLimitForAsset(
        store.baseAsset!,
        store.trade.isBuyActive,
        store.trade.baseAssetChannelBalance!,
        store.trade.baseAssetLimits!
      )!;
      return satsToCoins(limit);
    },
    get actualMaxAmount(): number | undefined {
      const limit = getLimitForAsset(
        store.baseAsset!,
        store.trade.isBuyActive,
        store.trade.baseAssetChannelBalance!,
        store.trade.baseAssetLimits!,
        true
      );
      return limit !== undefined ? satsToCoins(limit) : limit;
    },
    get isAmountValid(): boolean {
      return (
        store.actualMaxAmount === undefined ||
        store.trade.amount === undefined ||
        Number(store.trade.amount) <= store.actualMaxAmount
      );
    },
    get isTotalValid(): boolean {
      return (
        store.maxTotal === undefined ||
        store.trade.total === undefined ||
        Number(store.trade.total) <= store.maxTotal
      );
    },
    get maxTotal(): number | undefined {
      const limit = getLimitForAsset(
        store.quoteAsset!,
        !store.trade.isBuyActive,
        store.trade.quoteAssetChannelBalance!,
        store.trade.quoteAssetLimits!,
        true
      );
      return limit !== undefined ? satsToCoins(limit) : limit;
    },
    get currentOrderBookPrice(): number | undefined {
      return store.trade.isBuyActive
        ? store.trade.currentSellMarketPrice
        : store.trade.currentBuyMarketPrice;
    },
  });

  return store;
};
