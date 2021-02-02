import { Order } from "./Order";

export type ListordersResponse = {
  orders: { [key: string]: { buy_orders: Order[]; sell_orders: Order[] } };
};
