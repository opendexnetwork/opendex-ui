import { OrderOwner } from "../enums";

export type ListordersParams = {
  pairId?: string;
  owner?: OrderOwner;
  limit?: number;
};
