import { OrderSide } from "../enums";

export type PlaceOrderParams = {
  price?: number;
  quantity: number;
  pairId: string;
  side: OrderSide;
  orderId?: string;
  replaceOrderId?: string;
  immediateOrCancel?: boolean;
};
