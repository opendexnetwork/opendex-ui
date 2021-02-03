import { Fees } from "./BoltzFees";
import { Limits } from "./BoltzLimits";

export type DepositResponse = {
  id: string;
  address: string;
  timeoutBlockHeight: number;
  fees: Fees;
  limits: Limits;
};
