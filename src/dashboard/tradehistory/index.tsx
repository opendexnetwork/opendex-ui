import { Grid } from "@material-ui/core";
import React, { ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import api from "../../api";
import { satsToCoins } from "../../common/currencyUtil";
import PageCircularProgress from "../../common/pageCircularProgress";
import SortingOptions, {
  SortOption,
} from "../../common/sorting/sortingOptions";
import {
  getComparator,
  SortingOrder,
  stableSort,
} from "../../common/sorting/SortingUtil";
import Table from "../../common/Table";
import { OrderRole } from "../../enums";
import { Trade } from "../../models/Trade";
import { TradehistoryResponse } from "../../models/TradehistoryResponse";
import DashboardContent, { DashboardContentState } from "../DashboardContent";
import ViewDisabled from "../viewDisabled";
import TradehistoryDownload from "./tradehistoryDownload";

//styles
import { Content } from './styles';

export type TradeRow = {
  swapHash: string;
  price: number;
  priceStr: string;
  orderId: string;
  executedAt: Date;
  role: string;
  side: string;
  amount: number;
  amountStr: string;
  baseAsset: string;
  quoteAsset: string;
};

export type TradeHeader = {
  label: string;
  key: keyof TradeRow;
  copyIcon?: boolean;
  gridsXs?: 1 | 2 | 3 | 4;
  gridsXl?: 1 | 2 | 3 | 4;
};

type PropsType = RouteComponentProps<{ param1: string }>;

type StateType = DashboardContentState & {
  trades?: TradehistoryResponse;
  rows: TradeRow[];
  orderBy: SortOption<TradeRow>;
  sortingOrder: SortingOrder;
};

const getRowId = (row: TradeRow): string => {
  return row.swapHash ? row.swapHash : row.orderId + Math.random();
};

class Tradehistory extends DashboardContent<PropsType, StateType> {
  tableHeaders: TradeHeader[] = [
    { label: "Swap hash", key: "swapHash", copyIcon: true, gridsXl: 3 },
    { label: "Side", key: "side", gridsXs: 1 },
    { label: "Amount", key: "amountStr" },
    { label: "Role", key: "role", gridsXs: 1 },
    { label: "Price", key: "priceStr" },
    { label: "Order ID", key: "orderId", copyIcon: true },
    { label: "Time", key: "executedAt", gridsXl: 1 },
  ];
  csvHeaders: TradeHeader[] = [
    { label: "Swap hash", key: "swapHash" },
    { label: "Side", key: "side" },
    { label: "Amount", key: "amount" },
    { label: "Base asset", key: "baseAsset" },
    { label: "Price", key: "price" },
    { label: "Quote asset", key: "quoteAsset" },
    { label: "Role", key: "role" },
    { label: "Order ID", key: "orderId" },
    { label: "Time", key: "executedAt" },
  ];

  sortOpts: SortOption<TradeRow>[] = [
    { label: "Time", prop: "executedAt" },
    { label: "Amount", prop: "amount", groupBy: "baseAsset" },
    { label: "Price", prop: "price", groupBy: "quoteAsset" },
    { label: "Buy", prop: "side", sortingOrder: "asc" },
    { label: "Sell", prop: "side", sortingOrder: "desc" },
    { label: "Maker", prop: "role", sortingOrder: "asc" },
    { label: "Taker", prop: "role", sortingOrder: "desc" },
  ];

  constructor(props: PropsType) {
    super(props);
    this.state = {
      rows: [],
      orderBy: this.sortOpts[0],
      sortingOrder: this.sortOpts[0].sortingOrder || "desc",
    };
    this.refreshableData.push({
      queryFn: api.tradehistory$,
      stateProp: "trades",
      onSuccessCb: (trades: TradehistoryResponse) =>
        this.setState({ rows: this.createRows(trades.trades) }),
    });
  }

  createRows = (trades: Trade[]): TradeRow[] => {
    return (trades || []).map((trade) => {
      const order =
        trade.role === OrderRole.MAKER ? trade.maker_order : trade.taker_order;
      const [baseCurrency, quoteCurrency] = trade.pair_id.split("/");
      const amount = satsToCoins(trade.quantity);
      return {
        swapHash: trade.r_hash,
        amountStr: `${amount.toFixed(8)} ${baseCurrency}`,
        priceStr: `${trade.price.toFixed(8)} ${quoteCurrency}`,
        orderId: order.id,
        executedAt: new Date(Number(trade.executed_at)),
        role: trade.role.toLowerCase(),
        side: trade.side.toLowerCase(),
        amount: amount,
        price: trade.price,
        baseAsset: baseCurrency,
        quoteAsset: quoteCurrency,
      };
    });
  };

  onSortOptionSelect = (opt: SortOption<TradeRow>): void => {
    this.setState({
      orderBy: opt,
      sortingOrder:
        opt.sortingOrder ||
        (this.state.orderBy !== opt || this.state.sortingOrder === "asc"
          ? "desc"
          : "asc"),
    });
  };

  render(): ReactElement {
    return (
      <Grid container direction="column">
        {this.state.opendexdLocked || this.state.opendexdNotReady ? (
          <ViewDisabled
            opendexdLocked={this.state.opendexdLocked}
            opendexdStatus={this.state.opendexdStatus}
          />
        ) : this.state.rows?.length ? (
          <>
            <Content container direction="column">
              <SortingOptions
                sortOpts={this.sortOpts}
                orderBy={this.state.orderBy}
                sortingOrder={this.state.sortingOrder}
                onOptionSelected={this.onSortOptionSelect}
              ></SortingOptions>
              <Table
                headers={this.tableHeaders}
                rows={stableSort(
                  this.state.rows,
                  getComparator(
                    this.state.orderBy.sortingOrder || this.state.sortingOrder,
                    this.state.orderBy.prop,
                    this.state.orderBy.groupBy
                  )
                )}
                getRowId={getRowId}
                defaultGridXs={2}
                defaultGridXl={2}
              />
            </Content>
            <TradehistoryDownload
              headers={this.csvHeaders}
              rows={this.state.rows}
            />
          </>
        ) : this.state.initialLoadCompleted ? (
          <Grid item container justify="center">
            No trades to display
          </Grid>
        ) : (
          <PageCircularProgress />
        )}
      </Grid>
    );
  }
}

export default withRouter(Tradehistory);