import { combineLatest, PartialObserver } from "rxjs";
import { filter, map, mergeMap, pluck, shareReplay } from "rxjs/operators";
import api from "../../api";
import { Fees } from "../../models/BoltzFees";
import { Limits } from "../../models/BoltzLimits";
import { CreateReverseSwapResponse } from "../../models/CreateReverseSwapResponse";

export const getMaxWithdrawAmount = (
  channelBalance: string | number,
  limits: Limits
): number => {
  return Math.min(Number(limits.maximal), Number(channelBalance));
};

export const isReverseSwapFeesChanged = (
  newValue: Fees,
  currentValue: Fees
): boolean => {
  return (
    newValue.miner.reverse !== currentValue.miner.reverse ||
    newValue.percentage !== currentValue.percentage
  );
};

export const isAmountBetweenLimits = (
  amount: number,
  channelBalance: string | number,
  limits: Limits
): boolean => {
  return (
    Number(limits.minimal) <= amount &&
    getMaxWithdrawAmount(channelBalance, limits) >= amount
  );
};

export const withdraw = (
  currency: string,
  amount: number,
  address: string,
  currentFees: Fees,
  feesChangedHandler: PartialObserver<Fees>,
  invalidAmountHandler: PartialObserver<[Limits, string]>,
  withdrawHandler: PartialObserver<CreateReverseSwapResponse>
): void => {
  const channelbalance$ = api.getbalance$().pipe(
    shareReplay({ refCount: true, bufferSize: 1 }),
    map((resp) => resp.balances[currency.toUpperCase()]?.channel_balance)
  );
  const serviceinfo$ = api
    .boltzServiceInfo$(currency)
    .pipe(shareReplay({ refCount: true, bufferSize: 1 }));
  const fees$ = serviceinfo$.pipe(pluck("fees"));
  const limits$ = combineLatest([
    serviceinfo$.pipe(pluck("limits")),
    channelbalance$,
  ]);

  fees$
    .pipe(filter((resp) => isReverseSwapFeesChanged(resp, currentFees)))
    .subscribe(feesChangedHandler);

  limits$
    .pipe(
      filter(
        ([limits, balance]) => !isAmountBetweenLimits(amount, balance, limits)
      )
    )
    .subscribe(invalidAmountHandler);

  combineLatest([
    fees$.pipe(filter((resp) => !isReverseSwapFeesChanged(resp, currentFees))),
    limits$.pipe(
      filter(([limits, balance]) =>
        isAmountBetweenLimits(amount, balance, limits)
      )
    ),
  ])
    .pipe(mergeMap(() => api.boltzWithdraw$(currency, { amount, address })))
    .subscribe(withdrawHandler);
};
