export type Fees = {
  percentage: number;
  miner: MinerFees;
};

export type MinerFees = {
  normal: number;
  reverse: number;
};
