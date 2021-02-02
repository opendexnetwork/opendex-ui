import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ReactElement } from "react";
import { satsToCoinsStr } from "../../../common/currencyUtil";
import { Bucket } from "../../../models/OrderBookResponse";

type OrdersProps = {
  buckets: Bucket[];
  isBuy?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      flex: 2,
      flexWrap: "nowrap",
      overflowY: "auto",
      paddingRight: theme.spacing(1),
    },
    sellWrapper: {
      "& :first-child": {
        marginBottom: 0,
      },
    },
    row: {
      marginBottom: theme.spacing(1),
    },
    /* highlightedRow: {
      backgroundColor: theme.palette.grey[800],
    }, */
  })
);

const Orders = (props: OrdersProps): ReactElement => {
  const { buckets, isBuy } = props;
  const classes = useStyles();

  const getRowKey = (bucket: Bucket): string =>
    `${isBuy ? "buy" : "sell"}_ ${bucket.price}`;

  const wrapperClass = isBuy
    ? classes.wrapper
    : `${classes.wrapper} ${classes.sellWrapper}`;

  /* const isOwnOrder = (price: number): boolean => {
        const orders = isBuy
          ? tradeStore!.openBuyOrders
          : tradeStore!.openSellOrders;
        return orders.map((o) => o.price).includes(price);
      }; */

  /* const getRowClass = (row: Bucket): string =>
        isOwnOrder(row.price)
          ? `${classes.row} ${classes.highlightedRow}`
          : classes.row; */

  return (
    <Grid
      item
      container
      className={wrapperClass}
      direction={isBuy ? "column" : "column-reverse"}
    >
      {buckets.length ? (
        buckets.map((bucket) => (
          <Grid
            item
            container
            justify="space-between"
            wrap="nowrap"
            key={getRowKey(bucket)}
            className={classes.row}
          >
            <Typography variant="body2" key="amount">
              {satsToCoinsStr(bucket.quantity)}
            </Typography>
            <Typography
              variant="body2"
              align="right"
              color={isBuy ? "primary" : "secondary"}
              key="price"
            >
              {bucket.price.toFixed(8)}
            </Typography>
          </Grid>
        ))
      ) : (
        <Grid item container justify="center" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            No {isBuy ? "buy" : "sell"} orders
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default Orders;
