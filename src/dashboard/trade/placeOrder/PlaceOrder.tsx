import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  ThemeProvider,
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import { combineLatest, Subscription, timer } from "rxjs";
import { exhaustMap, retry } from "rxjs/operators";
import api from "../../../api";
import ErrorMessage from "../../../common/ErrorMessage";
import { getErrorMsg } from "../../../common/errorUtil";
import Loader from "../../../common/Loader";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";
import { darkTheme, tradeTheme } from "../../../themes";
import SectionTitle from "../SectionTitle";
import { isMarketOrder } from "../tradeUtil";
import AmountDetails from "./AmountDetails";
import AmountInput from "./AmountInput";
import OrderSideButtons from "./OrderSideButtons";
import PlaceOrderButton from "./PlaceOrderButton";
import PriceInput from "./PriceInput";
import TotalInput from "./TotalInput";

type PlaceOrderProps = {
  tradeStore?: TradeStore;
};

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    wrapper: {
      padding: theme.spacing(2),
      position: "relative",
    },
    content: {
      flex: 1,
    },
    row: {
      marginTop: theme.spacing(2),
    },
    resultMessageContainer: {
      margin: `${theme.spacing(2)}px 0`,
    },
  });
});

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
      const classes = useStyles();
      const [loadingErrors, setLoadingErrors] = useState<Set<string>>(
        new Set()
      );
      const [orderError, setOrderError] = useState("");
      const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);
      const id = "placeOrder";

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

      const color = tradeStore!.isBuyActive ? "primary" : "secondary";

      return (
        <div className={classes.wrapper} id={id}>
          <ThemeProvider theme={tradeTheme}>
            <SectionTitle title="Place Order" />
            {!initialLoadCompleted || loadingErrors.size ? (
              <>
                {!initialLoadCompleted ? (
                  <Loader />
                ) : (
                  <ErrorMessage
                    details={[...loadingErrors].map((err) => {
                      return {
                        detail: err,
                        key: err.substr(0, 10) + err.substr(err.length - 4),
                      };
                    })}
                  />
                )}
                <Grid item container />
              </>
            ) : (
              !!tradeStore!.baseAssetLimits &&
              !!tradeStore!.quoteAssetLimits && (
                <Grid
                  item
                  container
                  direction="column"
                  className={classes.content}
                >
                  <OrderSideButtons
                    onClick={() => resetMetaData()}
                    className={classes.row}
                  />
                  <ThemeProvider theme={darkTheme}>
                    <PriceInput
                      onOrderTypeChange={() => resetMetaData()}
                      onPriceChange={() => resetMetaData()}
                      className={classes.row}
                    />
                    <AmountInput
                      onAmountChange={() => resetMetaData()}
                      className={classes.row}
                    />
                  </ThemeProvider>
                  <AmountDetails
                    onSliderValueChange={() => resetMetaData()}
                    color={color}
                    className={classes.row}
                  />
                  {!isMarketOrder(tradeStore!.orderType) && (
                    <ThemeProvider theme={darkTheme}>
                      <TotalInput
                        onTotalChange={() => resetMetaData()}
                        className={classes.row}
                      />
                    </ThemeProvider>
                  )}
                  <Grid
                    item
                    container
                    className={classes.resultMessageContainer}
                  >
                    {orderError && (
                      <ErrorMessage
                        mainMessage="Failed to place order"
                        details={orderError}
                      />
                    )}
                  </Grid>
                  <PlaceOrderButton
                    color={color}
                    contentId={id}
                    onClick={() => {
                      setOrderError("");
                    }}
                    onSuccess={() => {
                      resetFormData(tradeStore!);
                    }}
                    onError={(err) => setOrderError(getErrorMsg(err))}
                  />
                </Grid>
              )
            )}
          </ThemeProvider>
        </div>
      );
    }
  )
);

export default PlaceOrder;
