import { NodeInfo } from "./NodeInfo";

export type Order = {
  price: number;
  quantity: string;
  pair_id: string;
  id: string;
  node_identifier: NodeInfo;
  local_id: string;
  created_at: string;
  side: string;
  is_own_order: boolean;
  hold: number;
};
