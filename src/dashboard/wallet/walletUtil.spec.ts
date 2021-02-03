import { Fees } from "../../models/BoltzFees";
import {
  getMaxWithdrawAmount,
  isAmountBetweenLimits,
  isReverseSwapFeesChanged,
} from "./walletUtil";

describe("getMaxWithdrawAmount", () => {
  it("returns channelBalance if it is less than maximal limit", () => {
    expect(
      getMaxWithdrawAmount("2362", { minimal: "0", maximal: "23620" })
    ).toEqual(2362);
    expect(
      getMaxWithdrawAmount(100, { minimal: "100", maximal: "101" })
    ).toEqual(100);
    expect(
      getMaxWithdrawAmount(0, { minimal: "100", maximal: "10000" })
    ).toEqual(0);
  });

  it("returns maximal limit if it is less than channelBalance", () => {
    expect(
      getMaxWithdrawAmount("888888", { minimal: "0", maximal: "1010" })
    ).toEqual(1010);
    expect(
      getMaxWithdrawAmount(100000, { minimal: "100", maximal: "6000" })
    ).toEqual(6000);
    expect(getMaxWithdrawAmount(1, { minimal: "0", maximal: "0" })).toEqual(0);
  });
});

describe("isAmountBetweenLimits", () => {
  it("true if equal to maximal", () => {
    expect(
      isAmountBetweenLimits(120, 9000, { minimal: "10", maximal: "120" })
    ).toEqual(true);
    expect(
      isAmountBetweenLimits(120, 120, { minimal: "10", maximal: "12000" })
    ).toEqual(true);
    expect(
      isAmountBetweenLimits(120, "120", { minimal: "10", maximal: "12000" })
    ).toEqual(true);
  });

  it("true if equal to minimal limit", () => {
    expect(
      isAmountBetweenLimits(10, 9000, { minimal: "10", maximal: "120" })
    ).toEqual(true);
  });

  it("true if between minimal and maximal", () => {
    expect(
      isAmountBetweenLimits(100, 9000, { minimal: "10", maximal: "120" })
    ).toEqual(true);
    expect(
      isAmountBetweenLimits(100, "111", { minimal: "10", maximal: "1200" })
    ).toEqual(true);
  });

  it("false if less than minimal", () => {
    expect(
      isAmountBetweenLimits(10, 9000, { minimal: "11", maximal: "120" })
    ).toEqual(false);
  });

  it("false if more than maximal", () => {
    expect(
      isAmountBetweenLimits(100, 90, { minimal: "10", maximal: "120" })
    ).toEqual(false);
    expect(
      isAmountBetweenLimits(11, "9", { minimal: "10", maximal: "120" })
    ).toEqual(false);
    expect(
      isAmountBetweenLimits(100, "111", { minimal: "10", maximal: "90" })
    ).toEqual(false);
  });
});

describe("isReverseSwapFeesChanged", () => {
  const oldValue: Fees = {
    percentage: 2,
    miner: { normal: 300, reverse: 500 },
  };

  it("true if miner.reverse changed", () => {
    expect(
      isReverseSwapFeesChanged(
        {
          percentage: 2,
          miner: { normal: 300, reverse: 600 },
        },
        oldValue
      )
    ).toEqual(true);
  });

  it("true if percentage changed", () => {
    expect(
      isReverseSwapFeesChanged(
        {
          percentage: 1.5,
          miner: { normal: 300, reverse: 500 },
        },
        oldValue
      )
    ).toEqual(true);
  });

  it("true if miner.reverse and percentage changed", () => {
    expect(
      isReverseSwapFeesChanged(
        {
          percentage: 3,
          miner: { normal: 500, reverse: 900 },
        },
        oldValue
      )
    ).toEqual(true);
  });

  it("false if neither miner.reverse nor percentage changed", () => {
    expect(
      isReverseSwapFeesChanged(
        {
          percentage: 2,
          miner: { normal: 200, reverse: 500 },
        },
        oldValue
      )
    ).toEqual(false);
  });
});
