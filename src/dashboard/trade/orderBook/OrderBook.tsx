import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { timer } from "rxjs";
import { exhaustMap, retry } from "rxjs/operators";
import api from "../../../api";
import { getErrorMsg } from "../../../common/errorUtil";
import SectionTitle from "../SectionTitle";
import { Bucket } from "../../../models/OrderBookResponse";
import Loader from "../../../common/Loader";
import ErrorMessage from "../../../common/ErrorMessage";
import Orders from "./Orders";
import { tradeTheme } from "../../../themes";
import { inject, observer } from "mobx-react";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";

type OrderBookProps = {
  tradeStore?: TradeStore;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      flexWrap: "nowrap",
      overflowY: "auto",
      padding: theme.spacing(2),
    },
    content: {
      flex: 1,
      flexWrap: "nowrap",
      overflowY: "auto",
    },
    row: {
      margin: `${theme.spacing(2)}px 0`,
      paddingRight: theme.spacing(1),
    },
  })
);

const OrderBook = inject(TRADE_STORE)(
  observer(
    (props: OrderBookProps): ReactElement => {
      const {
        activePair,
        isBuyActive,
        setCurrentBuyMarketPrice,
        setCurrentSellMarketPrice,
        currentOrderBookPrice: currentPrice,
      } = props.tradeStore!;
      const classes = useStyles();
      const [baseAsset, quoteAsset] = activePair!.split("/");
      const [buyBuckets, setBuyBuckets] = useState<Bucket[]>([]);
      const [sellBuckets, setSellBuckets] = useState<Bucket[]>([]);
      const [error, setError] = useState("");
      const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);

      useEffect(() => {
        setInitialLoadCompleted(false);
        setError("");
        setSellBuckets([]);
        setBuyBuckets([]);
        setCurrentBuyMarketPrice(undefined);
        setCurrentSellMarketPrice(undefined);
        const sub = timer(0, 2000)
          .pipe(
            exhaustMap(() =>
              api.orderbook$({ pairId: activePair, precision: 8, limit: 30 })
            ),
            retry(3)
          )
          .subscribe({
            next: (resp) => {
              const bucket = resp.buckets[activePair!];
              setBuyBuckets(bucket.buyBuckets);
              setSellBuckets(bucket.sellBuckets);
              setCurrentSellMarketPrice(bucket.sellBuckets[0]?.price);
              setCurrentBuyMarketPrice(bucket.buyBuckets[0]?.price);
              setError("");
              setInitialLoadCompleted(true);
            },
            error: (err) => {
              setError(getErrorMsg(err));
              setInitialLoadCompleted(true);
            },
          });
        return () => sub.unsubscribe();
      }, [activePair, setCurrentBuyMarketPrice, setCurrentSellMarketPrice]);

      return (
        <Grid item container className={classes.wrapper}>
          <SectionTitle title="Order Book" />
          {!initialLoadCompleted || error ? (
            <>
              {!initialLoadCompleted ? (
                <Loader />
              ) : (
                <ErrorMessage details={error} />
              )}
              <Grid item container />
            </>
          ) : (
            <ThemeProvider theme={tradeTheme}>
              <Grid
                item
                container
                direction="column"
                className={classes.content}
              >
                <Grid
                  item
                  container
                  justify="space-between"
                  className={classes.row}
                >
                  <Typography>Amount ({baseAsset})</Typography>
                  <Typography align="right">Price ({quoteAsset})</Typography>
                </Grid>
                <Orders buckets={sellBuckets} />
                <Grid item container justify="center" className={classes.row}>
                  <Typography color={isBuyActive ? "secondary" : "primary"}>
                    {currentPrice}
                  </Typography>
                </Grid>
                <Orders buckets={buyBuckets} isBuy />
              </Grid>
            </ThemeProvider>
          )}
        </Grid>
      );
    }
  )
);

export default OrderBook;
