import { ButtonGroup, makeStyles } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import Button from "../../../common/components/input/buttons/Button";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";

type OrderSideButtonsProps = {
  onClick: () => void;
  className?: string;
  tradeStore?: TradeStore;
};

const useStyles = makeStyles((theme) => ({
  buyButton: (props: OrderSideButtonsProps) => ({
    fontSize: "16px",
    color: props.tradeStore!.isBuyActive
      ? theme.palette.primary.main
      : "#636363",
    border: "none",
    borderBottom: props.tradeStore!.isBuyActive
      ? `2px solid ${theme.palette.primary.main}`
      : "2px solid #232322",

    borderRadius: "initial",
    "&:hover": {
      backgroundColor: "transparent",
    },
  }),
  sellButton: (props: OrderSideButtonsProps) => ({
    fontSize: "16px",
    color: props.tradeStore!.isBuyActive
      ? "#636363"
      : theme.palette.secondary.main,
    border: "none",
    borderBottom: props.tradeStore!.isBuyActive
      ? "2px solid #232322"
      : `2px solid ${theme.palette.secondary.main}`,

    borderRadius: "initial",
    "&:hover": {
      backgroundColor: "transparent",
    },
  }),
}));

const OrderSideButtons = inject(TRADE_STORE)(
  observer(
    (props: OrderSideButtonsProps): ReactElement => {
      const classes = useStyles(props);
      const { tradeStore, onClick, className } = props;

      return (
        <ButtonGroup fullWidth disableElevation className={className}>
          <Button
            text="Buy"
            onClick={() => {
              tradeStore!.setIsBuyActive(true);
              onClick();
            }}
            className={classes.buyButton}
          />
          <Button
            text="Sell"
            onClick={() => {
              tradeStore!.setIsBuyActive(false);
              onClick();
            }}
            className={classes.sellButton}
          />
        </ButtonGroup>
      );
    }
  )
);

export default OrderSideButtons;
