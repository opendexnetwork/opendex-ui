import React, { ReactElement } from "react";
import { inject, observer } from "mobx-react";
import { ButtonGroup, makeStyles } from "@material-ui/core";
import { OrderType } from "../../../enums";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";
import Button from "../../../common/components/input/buttons/Button";

const useStyles = makeStyles(() => ({
  button: {
    textTransform: "none",
    borderRadius: "initial",
    fontSize: "14px",
    padding: "2px 14px",
  },
  marketActive: {
    backgroundColor: "#29cc78",
    color: "#0c0c0c",
    borderColor: "#29cc78",
    "&:hover": {
      backgroundColor: "#29cc78",
    },
  },
  marketInActive: {
    backgroundColor: "#181818",
    color: "#e63939",
    borderColor: "#e63939",
    "&:hover": {
      backgroundColor: "#181818",
    },
  },
  limitActive: {
    backgroundColor: "#e63939",
    color: "#181818",
    borderColor: "#e63939",
    "&:hover": {
      backgroundColor: "#e63939",
    },
  },
  limitInActive: {
    backGroundColor: "#181818",
    color: "#29cc78",
    borderColor: "#29cc78",
    "&:hover": {
      backgroundColor: "#181818",
    },
  },
  buttonGroup: {
    display: "initial",
  },
}));

type OrderTypeButtonsProps = {
  onOrderTypeChange: () => void;
  className?: string;
  tradeStore?: TradeStore;
};

const OrderTypeButtons = inject(TRADE_STORE)(
  observer(
    (props: OrderTypeButtonsProps): ReactElement => {
      const { onOrderTypeChange, tradeStore } = props;
      const classes = useStyles();

      return (
        <ButtonGroup disableElevation className={classes.buttonGroup}>
          <Button
            className={
              tradeStore!.orderType === "Market"
                ? `${classes.marketActive} ${classes.button}`
                : `${classes.marketInActive} ${classes.button}`
            }
            text="Market"
            value="Market"
            onClick={(event) => {
              tradeStore!.setOrderType(event.currentTarget.value as OrderType);
              onOrderTypeChange();
            }}
          />
          <Button
            className={
              tradeStore!.orderType === "Limit"
                ? `${classes.limitActive} ${classes.button}`
                : `${classes.limitInActive} ${classes.button}`
            }
            text="Limit"
            value="Limit"
            onClick={(event) => {
              tradeStore!.setOrderType(event.currentTarget.value as OrderType);
              onOrderTypeChange();
            }}
          />
        </ButtonGroup>
      );
    }
  )
);

export default OrderTypeButtons;
