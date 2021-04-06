import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  ThemeProvider,
} from "@material-ui/core";
import React, { ReactElement, SetStateAction, Dispatch } from "react";
import { inject, observer } from "mobx-react";
import ErrorMessage from "../../../common/components/data-display/ErrorMessage";
import { getErrorMsg } from "../../../common/utils/errorUtil";
import Loader from "../../../common/components/data-display/loader/Loader";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";
import { tradeTheme } from "../../../themes";
import { isMarketOrder } from "../tradeUtil";
import AmountDetails from "./AmountDetails";
import AmountInput from "./AmountInput";
import OrderSideButtons from "./OrderSideButtons";
import PlaceOrderButton from "./PlaceOrderButton";
import PriceInput from "./PriceInput";
import TotalInput from "./TotalInput";
import OrderTypeButtons from "./OrderTypeButtons";
import SectionTitle from "../../../common/components/data-display/text/SectionTitle";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    wrapper: {
      maxWidth: "550px",
    },
    wrapperWithoutPlaceOrderButton: {
      padding: "10px 20px",
      position: "relative",
      backgroundColor: "#181818",
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
    inputAdornment: {
      color: "#636363",
    },
    titleAndOrderTypeContainer: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
    },
  });
});

type PlaceOrderContentProps = {
  initialLoadCompleted: boolean;
  loadingErrors: any;
  resetMetaData: () => void;
  resetFormData: (tradeStore: TradeStore) => void;
  tradeStore?: TradeStore;
  setOrderError: Dispatch<SetStateAction<string>>;
  orderError: string;
};

const PlaceOrderContent = inject(TRADE_STORE)(
  observer(
    (props: PlaceOrderContentProps): ReactElement => {
      const classes = useStyles();
      const id = "placeOrder";
      const {
        initialLoadCompleted,
        loadingErrors,
        resetMetaData,
        resetFormData,
        tradeStore,
        setOrderError,
        orderError,
      } = props;

      const color = tradeStore!.isBuyActive ? "primary" : "secondary";

      return (
        <ThemeProvider theme={tradeTheme}>
          <div className={classes.wrapper} id={id}>
            <div className={classes.wrapperWithoutPlaceOrderButton}>
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
                  <Grid item container className={classes.content}>
                    <div className={classes.titleAndOrderTypeContainer}>
                      <SectionTitle title="Place Order" />
                      <OrderTypeButtons
                        onOrderTypeChange={() => resetMetaData()}
                        className={classes.row}
                      />
                    </div>

                    <OrderSideButtons
                      onClick={() => resetMetaData()}
                      className={classes.row}
                    />

                    <PriceInput
                      onPriceChange={() => resetMetaData()}
                      className={classes.row}
                      InputAdornmentClass={classes.inputAdornment}
                    />

                    <AmountInput
                      onAmountChange={() => resetMetaData()}
                      className={classes.row}
                      InputAdornmentClass={classes.inputAdornment}
                    />

                    <AmountDetails
                      onSliderValueChange={() => resetMetaData()}
                      color={color}
                      className={classes.row}
                    />
                    {!isMarketOrder(tradeStore!.orderType) && (
                      <TotalInput
                        onTotalChange={() => resetMetaData()}
                        className={classes.row}
                        InputAdornmentClass={classes.inputAdornment}
                      />
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
                  </Grid>
                )
              )}
            </div>
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
          </div>
        </ThemeProvider>
      );
    }
  )
);

export default PlaceOrderContent;
