const SATOSHIS_PER_COIN = 10 ** 8;

const CURRENCY_DICTIONARY: {
  [key: string]: { fullName?: string };
} = {
  BTC: { fullName: "Bitcoin" },
  LTC: { fullName: "Litecoin" },
  ETH: {},
  USDT: {},
  WETH: {},
  DAI: {},
  XUC: {},
};

export const satsToCoinsStr = (
  valueInSats: string | number,
  currency?: string
): string => {
  const sats =
    typeof valueInSats === "string" ? Number(valueInSats) : valueInSats;
  const coinsFixedStr = (sats / SATOSHIS_PER_COIN).toFixed(8);
  return currency ? `${coinsFixedStr} ${currency}` : coinsFixedStr;
};

/** Returns a number of satoshis as coins with up to 8 decimal places. */
export const satsToCoins = (satsQuantity: string | number): number => {
  const sats =
    typeof satsQuantity === "string" ? Number(satsQuantity) : satsQuantity;
  return sats / SATOSHIS_PER_COIN;
};

/** Returns a number of coins as an integer number of satoshis. */
export const coinsToSats = (coinsQuantity: string | number): number => {
  const sats =
    typeof coinsQuantity === "string" ? Number(coinsQuantity) : coinsQuantity;
  return Math.round(sats * SATOSHIS_PER_COIN);
};

/**
 * Returns the full name of the currency listed in CURRENCY_DICTIONARY.
 * If currency is not present in the list or its full name is undefined,
 * returns the currency symbol that was given as argument.
 */
export const getCurrencyFullName = (currency: string): string => {
  const fullName = CURRENCY_DICTIONARY[currency.toUpperCase()]?.fullName;
  return fullName || currency;
};
