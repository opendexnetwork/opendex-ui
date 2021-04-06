import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import { combineLatest, Subscription, timer } from "rxjs";
import { exhaustMap, retry } from "rxjs/operators";
import api from "../../../api";
import { getErrorMsg } from "../../../common/utils/errorUtil";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";
import PlaceOrderContent from "./PlaceOrderContent";

type PlaceOrderProps = {
  tradeStore?: TradeStore;
};

const resetFormData = (tradeStore: TradeStore) => {
  tradeStore.setAmount("");
  tradeStore.setSliderValue(0);
  tradeStore.setPrice("");
};

const PlaceOrder = inject(TRADE_STORE)(
  observer(
    (props: PlaceOrderProps): ReactElement => {
      const { tradeStore } = props;
      const activePair = tradeStore!.activePair!;
      const [loadingErrors, setLoadingErrors] = useState<Set<string>>(
        new Set()
      );
      const [orderError, setOrderError] = useState("");
      const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);

      const resetMetaData = () => {
        setLoadingErrors(new Set());
        setOrderError("");
      };

      useEffect(() => {
        setInitialLoadCompleted(false);
        resetFormData(tradeStore!);
        resetMetaData();
        tradeStore!.setChannelBalances(undefined);
        tradeStore?.setTradingLimits(undefined);
        const sub = new Subscription();

        const getLoadingError = (
          baseVal: any,
          quoteVal: any,
          name: string
        ): string => {
          if ((!baseVal && baseVal !== 0) || (!quoteVal && quoteVal !== 0)) {
            return `${name} missing for ${[
              !baseVal && tradeStore!.baseAsset,
              !quoteVal && tradeStore!.quoteAsset,
            ]
              .filter((a) => !!a)
              .join(", ")}`;
          }
          return "";
        };

        const addError = (err: string, errSet: Set<string>): void => {
          if (err) {
            errSet.add(err);
          }
        };

        sub.add(
          timer(0, 2000)
            .pipe(
              exhaustMap(() =>
                combineLatest([api.getbalance$(), api.tradinglimits$()])
              ),
              retry(3)
            )
            .subscribe({
              next: (resp) => {
                const balance = resp[0];
                const limits = resp[1];
                const errors = new Set<string>();
                // set balances
                tradeStore!.setChannelBalances(balance);
                const balanceError = getLoadingError(
                  tradeStore!.baseAssetChannelBalance,
                  tradeStore!.quoteAssetChannelBalance,
                  "Balance"
                );
                addError(balanceError, errors);
                // set trading limits
                tradeStore!.setTradingLimits(limits);
                const limitError = getLoadingError(
                  tradeStore!.baseAssetLimits,
                  tradeStore?.quoteAssetLimits,
                  "Trading limits"
                );
                addError(limitError, errors);
                // set loading complete
                setInitialLoadCompleted(true);
                setLoadingErrors(errors);
              },
              error: (err) => {
                setInitialLoadCompleted(true);
                setLoadingErrors(new Set(getErrorMsg(err)));
              },
            })
        );
        return () => sub.unsubscribe();
      }, [tradeStore, activePair]);

      return (
        <PlaceOrderContent
          initialLoadCompleted={initialLoadCompleted}
          loadingErrors={loadingErrors}
          resetMetaData={resetMetaData}
          resetFormData={resetFormData}
          setOrderError={setOrderError}
          orderError={orderError}
          tradeStore={tradeStore}
        />
      );
    }
  )
);

export default PlaceOrder;
