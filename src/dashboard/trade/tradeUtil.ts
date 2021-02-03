import BigNumber from "bignumber.js";
import { OrderType } from "../../enums";
import { TradingLimits } from "../../models/TradingLimits";

export const isMarketOrder = (type: OrderType): boolean =>
  type === OrderType.MARKET;

export const getSellLimit = (
  isBuyOrder: boolean,
  baseAssetLimits: TradingLimits,
  quoteAssetLimits: TradingLimits
): number =>
  Number((isBuyOrder ? quoteAssetLimits : baseAssetLimits)?.max_sell);

export const getBuyLimit = (
  isBuyOrder: boolean,
  baseAssetLimits: TradingLimits,
  quoteAssetLimits: TradingLimits
): number => Number((isBuyOrder ? baseAssetLimits : quoteAssetLimits)?.max_buy);

export const getLimitForAsset = (
  asset: string,
  isBuy: boolean,
  channelBalance: number,
  limits: TradingLimits,
  actual?: boolean
): number | undefined => {
  const buyLimit = actual
    ? getActualBuyLimit(Number(limits?.max_buy), asset)
    : Number(limits?.max_buy);
  return isBuy ? buyLimit : Math.min(Number(limits?.max_sell), channelBalance);
};

export const calculateProduct = (
  multiplier1: string,
  multiplier2: string
): string => {
  return multiplier1 && multiplier2
    ? convertToTextFieldValue(
        new BigNumber(multiplier1).multipliedBy(new BigNumber(multiplier2))
      )
    : "";
};

export const calculateQuotient = (
  divider: string,
  dividend: string
): string => {
  return dividend && Number(divider) !== 0
    ? convertToTextFieldValue(
        new BigNumber(dividend).div(new BigNumber(divider))
      )
    : "";
};

export const convertToTextFieldValue = (value: BigNumber): string => {
  BigNumber.config({ DECIMAL_PLACES: 8 });
  return value || value === 0 ? value.toString(10) : "";
};

const getActualBuyLimit = (
  buyLimit: number,
  asset: string
): number | undefined =>
  ["BTC", "LTC"].includes(asset) ? buyLimit : undefined;
