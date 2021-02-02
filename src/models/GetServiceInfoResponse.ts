import { Fees } from "./BoltzFees";
import { Limits } from "./BoltzLimits";

export type GetServiceInfoResponse = {
  fees: Fees;
  limits: Limits;
};
