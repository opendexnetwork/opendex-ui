export enum CurrencyFormat {
  COINS = "coins",
  SATS = "sats",
}

export enum OrderRole {
  MAKER = "MAKER",
  TAKER = "TAKER",
}

export enum OrderType {
  MARKET = "Market",
  LIMIT = "Limit",
}

export enum OrderSide {
  BUY = 0,
  SELL = 1,
  BOTH = 2,
}

export enum OrderOwner {
  BOTH = 0,
  OWN = 1,
  PEER = 2,
}

export enum ConnectionType {
  LOCAL = "local",
  REMOTE = "remote",
}
