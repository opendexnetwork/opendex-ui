import { ButtonGroup } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import Button from "../../../common/components/input/buttons/Button";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";

type OrderSideButtonsProps = {
  onClick: () => void;
  className?: string;
  tradeStore?: TradeStore;
};

const OrderSideButtons = inject(TRADE_STORE)(
  observer(
    (props: OrderSideButtonsProps): ReactElement => {
      const { tradeStore, onClick, className } = props;

      return (
        <ButtonGroup fullWidth disableElevation className={className}>
          <Button
            text="Buy"
            onClick={() => {
              tradeStore!.setIsBuyActive(true);
              onClick();
            }}
            color="primary"
            variant={tradeStore!.isBuyActive ? "contained" : "outlined"}
          />
          <Button
            text="Sell"
            onClick={() => {
              tradeStore!.setIsBuyActive(false);
              onClick();
            }}
            color="secondary"
            variant={tradeStore!.isBuyActive ? "outlined" : "contained"}
          />
        </ButtonGroup>
      );
    }
  )
);

export default OrderSideButtons;
