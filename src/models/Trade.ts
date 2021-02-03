import { OrderRole } from "../enums";
import { NodeInfo } from "./NodeInfo";
import { Order } from "./Order";

export type Trade = {
  maker_order: Order;
  taker_order: Order;
  r_hash: string;
  quantity: string;
  pair_id: string;
  price: number;
  role: OrderRole;
  executed_at: string;
  side: string;
  counterparty: NodeInfo;
};
