import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import React, { ReactElement, useEffect, useState } from "react";
import { Observable, Subject } from "rxjs";
import { isLnd } from "../../common/currencyUtil";
import { getErrorMsg } from "../../common/errorUtil";
import { isServiceReady } from "../../common/serviceUtil";
import Balance from "../../models/Balance";
import { Info } from "../../models/Info";
import { Status } from "../../models/Status";
import { TradingLimits } from "../../models/TradingLimits";
import BalanceSummary from "./BalanceSummary";
import Deposit from "./Deposit";
import LimitsSummary from "./LimitsSummary";
import WalletItemHeader from "./WalletItemHeader";
import WalletTransactionButton from "./WalletTransactionButton";
import Withdraw from "./Withdraw";

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      height: 446,
      minWidth: 514,
    },
    cardContent: {
      padding: theme.spacing(3),
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    cardBody: {
      height: "100%",
    },
    viewContent: {
      paddingTop: theme.spacing(3),
    },
    rowsGroup: {
      paddingTop: theme.spacing(2),
    },
  })
);

const WalletItem = (props: WalletItemProps): ReactElement => {
  const classes = useStyles();
  const { balance, currency, limits, getInfo$, getBoltzStatus$ } = props;
  const [activeViewType, setActiveViewType] = useState(
    WalletItemViewType.BALANCE
  );
  const [refreshSubject, setRefreshSubject] = useState<
    Subject<void> | undefined
  >(undefined);
  const [
    boltzTransactionsDisabledCause,
    setBoltzTransactionsDisabledCause,
  ] = useState("Waiting for Boltz status");

  const isActive = (...type: WalletItemViewType[]): boolean =>
    type.includes(activeViewType);

  const getTxButtonDisabledMsg = (isDeposit?: boolean): string => {
    if (isLnd(currency)) {
      return boltzTransactionsDisabledCause;
    }
    return isDeposit ? "" : "Coming soon";
  };

  useEffect(() => {
    if (!isLnd(currency)) {
      return;
    }
    const sub = getBoltzStatus$.subscribe({
      next: (status) => {
        setBoltzTransactionsDisabledCause(
          isServiceReady(status)
            ? ""
            : `Boltz is not ready. Status: ${status.status}`
        );
      },
      error: (err) => {
        setBoltzTransactionsDisabledCause(
          `Boltz is unavailable. Error: ${getErrorMsg(err)}`
        );
      },
    });
    return () => sub.unsubscribe();
  }, [getBoltzStatus$, currency]);

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
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <WalletItemHeader
            currency={currency}
            refreshSubject={refreshSubject!}
            isActive={isActive}
            setActiveViewType={setActiveViewType}
          />
          <Grid
            item
            container
            direction="column"
            justify="space-between"
            className={classes.cardBody}
          >
            {views.map(
              (view) =>
                isActive(view.type) && (
                  <Grid
                    key={view.type}
                    item
                    container
                    direction="column"
                    className={classes.rowsGroup}
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
                    <Grid
                      item
                      container
                      direction="column"
                      className={classes.viewContent}
                    >
                      {view.component}
                    </Grid>
                  </Grid>
                )
            )}
            {isActive(
              WalletItemViewType.BALANCE,
              WalletItemViewType.LIMITS
            ) && (
              <Grid
                item
                container
                justify="center"
                spacing={4}
                className={classes.rowsGroup}
              >
                <WalletTransactionButton
                  text="Deposit"
                  disabledHint={getTxButtonDisabledMsg(true)}
                  onClick={() => setActiveViewType(WalletItemViewType.DEPOSIT)}
                />
                <WalletTransactionButton
                  text="Withdraw"
                  disabledHint={getTxButtonDisabledMsg()}
                  onClick={() => setActiveViewType(WalletItemViewType.WITHDRAW)}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default WalletItem;
