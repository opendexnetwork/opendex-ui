import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { ReactElement, useEffect, useState } from "react";
import { Observable, Subject } from "rxjs";
import { filter, mergeMap, pluck, take } from "rxjs/operators";
import { getErrorMsg } from "../../../common/errorUtil";
import { isServiceReady } from "../../../common/serviceUtil";
import Balance from "../../../models/Balance";
import { Info } from "../../../models/Info";
import { Status } from "../../../models/Status";
import { TradingLimits } from "../../../models/TradingLimits";
import BalanceSummary from "../balanceSummary";
import Deposit from "../deposit";
import LimitsSummary from "../limitsSummary";
import WalletItemHeader from "../walletItemHeader";
import WalletTransactionButton from "../walletTransactionButton";
import Withdraw from "../withdraw";

//styles
import {
  Card,
  CardContent,
  CardBody,
  ViewContent,
  RowsGroup
} from "./styles";

export type WalletItemProps = {
  currency: string;
  balance: Balance;
  getInfo$: Observable<Info>;
  getBoltzStatus$: Observable<Status>;
  limits?: TradingLimits;
};

export enum WalletItemViewType {
  BALANCE = "BALANCE",
  LIMITS = "LIMITS",
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
}

type WalletItemView = {
  type: WalletItemViewType;
  component: ReactElement;
  title?: string;
};

const transactionButtonsVisible = (currency: string): boolean =>
  ["BTC", "LTC"].includes(currency);

const WalletItem = (props: WalletItemProps): ReactElement => {
  const { balance, currency, limits, getInfo$, getBoltzStatus$ } = props;
  const [activeViewType, setActiveViewType] = useState(
    WalletItemViewType.BALANCE
  );
  const [refreshSubject, setRefreshSubject] = useState<
    Subject<void> | undefined
  >(undefined);
  const [transactionsDisabledCause, setTransactionsDisabledCause] = useState(
    "Waiting for Boltz status"
  );

  const isActive = (...type: WalletItemViewType[]): boolean =>
    type.includes(activeViewType);

  useEffect(() => {
    if (!transactionButtonsVisible(currency)) {
      return;
    }
    const network$ = getInfo$.pipe(take(1), pluck("network"));
    network$.subscribe((value) => {
      if (value.toLowerCase() === "simnet") {
        setTransactionsDisabledCause("Not available on Simnet");
      }
    });
    const sub = network$
      .pipe(
        filter((value) => value !== "simnet"),
        mergeMap(() => getBoltzStatus$)
      )
      .subscribe({
        next: (status) => {
          setTransactionsDisabledCause(
            isServiceReady(status)
              ? ""
              : `Boltz is not ready. Status: ${status.status}`
          );
        },
        error: (err) => {
          setTransactionsDisabledCause(
            `Boltz is unavailable. Error: ${getErrorMsg(err)}`
          );
        },
      });
    return () => sub.unsubscribe();
  }, [getInfo$, getBoltzStatus$, currency]);

  const views: WalletItemView[] = [
    {
      type: WalletItemViewType.BALANCE,
      component: <BalanceSummary balance={balance} />,
    },
    {
      type: WalletItemViewType.LIMITS,
      component: <LimitsSummary limits={limits!} currency={currency} />,
      title: "Trading Limits",
    },
    {
      type: WalletItemViewType.DEPOSIT,
      component: (
        <Deposit
          currency={currency}
          refreshSubject={refreshSubject!}
          getInfo$={getInfo$}
        />
      ),
      title: "Deposit",
    },
    {
      type: WalletItemViewType.WITHDRAW,
      component: (
        <Withdraw
          currency={currency}
          channelBalance={Number(balance.channel_balance)}
          onClose={() => setActiveViewType(WalletItemViewType.BALANCE)}
        />
      ),
      title: "Withdraw",
    },
  ];

  useEffect(() => {
    setRefreshSubject(new Subject<void>());
  }, []);

  return (
    <Grid item xs={12} lg={6} xl={4}>
      <Card>
        <CardContent>
          <WalletItemHeader
            currency={currency}
            refreshSubject={refreshSubject!}
            isActive={isActive}
            setActiveViewType={setActiveViewType}
          />
          <CardBody
            item
            container
            direction="column"
            justify="space-between"
          >
            {views.map(
              (view) =>
                isActive(view.type) && (
                  <RowsGroup
                    key={view.type}
                    item
                    container
                    direction="column"
                  >
                    {!!view.title && (
                      <Grid item container justify="center">
                        <Typography
                          component="h3"
                          variant="overline"
                          align="center"
                        >
                          <strong>{view.title}</strong>
                        </Typography>
                      </Grid>
                    )}
                    <ViewContent
                      item
                      container
                      direction="column"
                    >
                      {view.component}
                    </ViewContent>
                  </RowsGroup>
                )
            )}
            {isActive(WalletItemViewType.BALANCE, WalletItemViewType.LIMITS) &&
              transactionButtonsVisible(currency) && (
                <RowsGroup
                  item
                  container
                  justify="center"
                  spacing={6}
                >
                  <WalletTransactionButton
                    text="Deposit"
                    disabledHint={transactionsDisabledCause}
                    onClick={() =>
                      setActiveViewType(WalletItemViewType.DEPOSIT)
                    }
                  />
                  <WalletTransactionButton
                    text="Withdraw"
                    disabledHint={transactionsDisabledCause}
                    onClick={() =>
                      setActiveViewType(WalletItemViewType.WITHDRAW)
                    }
                  />
                </RowsGroup>
              )}
          </CardBody>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default WalletItem;
