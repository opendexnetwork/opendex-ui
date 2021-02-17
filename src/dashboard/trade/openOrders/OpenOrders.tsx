import { createStyles, Grid, makeStyles } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import { combineLatest, Subscription, timer } from "rxjs";
import { exhaustMap, retry } from "rxjs/operators";
import { getComparator, stableSort } from "../../../common/utils/SortingUtil";
import api from "../../../api";
import {
  satsToCoins,
  satsToCoinsStr,
} from "../../../common/utils/currencyUtil";
import ErrorMessage from "../../../common/components/data-display/ErrorMessage";
import { getErrorMsg } from "../../../common/utils/errorUtil";
import Loader from "../../../common/components/data-display/loader/Loader";
import Table, {
  TableHeader,
} from "../../../common/components/data-display/table/Table";
import { OrderOwner } from "../../../enums";
import { Order } from "../../../models/Order";
import { Trade } from "../../../models/Trade";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";
import SectionTitle from "../SectionTitle";
import CancelOrder from "./CancelOrder";

type OpenOrdersProps = {
  tradeStore?: TradeStore;
};

export type OrderRow = {
  pairId: string;
  orderId: string;
  orderSide: string;
  amount: string;
  price: number;
  filledPercentage: number;
  filledAmount: number;
  filled: string;
  createdAt: Date;
  action?: ReactElement;
};

export type CancelledOrder = Map<string, { pending: boolean; error: string }>;

const calculateFilledAmount = (order: Order, tradeHistory: Trade[]): number =>
  (tradeHistory || []).reduce((prev, current) => {
    return (current.pair_id === order.pair_id &&
      current.maker_order.id === order.id) ||
      current.taker_order?.id === order.id
      ? prev + Number(current.quantity)
      : prev;
  }, 0);

const calculateFilledPercentage = (
  filledAmount: number,
  totalAmount: number
): number => Number(((filledAmount * 100) / totalAmount).toFixed(2));

const composeFilledValue = (
  filledAmount: number,
  filledPercentage: number
): string => {
  return `${satsToCoins(filledAmount)} (${filledPercentage}%)`;
};

const createRows = (orders: Order[], tradeHistory: Trade[]): OrderRow[] =>
  orders.map((order) => createRow(order, tradeHistory));

const createRow = (order: Order, tradeHistory: Trade[]) => {
  const filledAmount = calculateFilledAmount(order, tradeHistory);
  const totalAmount = Number(order.quantity) + filledAmount;
  const filledPercentage = calculateFilledPercentage(filledAmount, totalAmount);
  return {
    pairId: order.pair_id,
    orderId: order.id,
    orderSide: order.side.toLowerCase(),
    amount: satsToCoinsStr(totalAmount),
    filledAmount: filledAmount,
    filledPercentage: filledPercentage,
    filled: composeFilledValue(filledAmount, filledPercentage),
    price: order.price,
    createdAt: new Date(Number(order.created_at)),
  };
};

const useStyles = makeStyles(() =>
  createStyles({
    content: {
      flex: 1,
      flexWrap: "nowrap",
      overflowY: "auto",
    },
  })
);

const OpenOrders = inject(TRADE_STORE)(
  observer(
    (props: OpenOrdersProps): ReactElement => {
      const {
        activePair,
        setOpenBuyOrders,
        setOpenSellOrders,
      } = props.tradeStore!;
      const classes = useStyles();
      const [rows, setRows] = useState<OrderRow[]>([]);
      const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);
      const [error, setError] = useState("");
      const [cancelled, setCancelled] = useState<CancelledOrder>(new Map());

      const headers: TableHeader<OrderRow>[] = [
        { label: "Pair", key: "pairId", gridsXs: 1, gridsXl: 1 },
        {
          label: "Order ID",
          key: "orderId",
          copyIcon: true,
        },
        { label: "Side", key: "orderSide", gridsXs: 1, gridsXl: 1 },
        { label: "Amount", key: "amount" },
        { label: "Price", key: "price" },
        { label: "Filled", key: "filled" },
        { label: "Action", key: "action" },
      ];

      useEffect(() => {
        const sub = new Subscription();
        setInitialLoadCompleted(false);
        setError("");
        sub.add(
          timer(0, 2000)
            .pipe(
              exhaustMap(() =>
                combineLatest([
                  api.listorders$({
                    owner: OrderOwner.OWN,
                  }),
                  api.tradehistory$(),
                ])
              ),
              retry(3)
            )
            .subscribe({
              next: (resp) => {
                const orders = (buy?: boolean): Order[] =>
                  Object.values(resp[0]?.orders).reduce(
                    (prev, current) =>
                      prev.concat(
                        buy ? current.buy_orders : current.sell_orders
                      ),
                    new Array<Order>()
                  );
                const buyOrders = orders(true);
                const sellOrders = orders();
                setOpenBuyOrders(buyOrders);
                setOpenSellOrders(sellOrders);
                setRows(
                  createRows(buyOrders.concat(sellOrders), resp[1].trades)
                );
                setError("");
                setInitialLoadCompleted(true);
              },
              error: (err) => {
                setError(getErrorMsg(err));
                setInitialLoadCompleted(true);
              },
            })
        );
        return () => sub.unsubscribe();
      }, [activePair, setOpenBuyOrders, setOpenSellOrders]);

      return (
        <>
          <SectionTitle
            title="Open Orders"
            info="If the MM bot is set up, equal and opposite side mirror trade will get triggered as soon as an open order is executed"
          />
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
            <Grid item container direction="column" className={classes.content}>
              <Table
                headers={headers}
                rows={stableSort(
                  rows.map((row) => {
                    row.action = (
                      <CancelOrder
                        row={row}
                        cancelledOrders={cancelled}
                        setCancelledOrders={setCancelled}
                      />
                    );
                    return row;
                  }),
                  getComparator("desc", "createdAt")
                )}
                getRowId={(row) => row.orderId}
                defaultGridXs={2}
                defaultGridXl={2}
              />
            </Grid>
          )}
        </>
      );
    }
  )
);

export default OpenOrders;
