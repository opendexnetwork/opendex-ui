import { inject, observer } from "mobx-react";
import React, { ReactElement, useState } from "react";
import api from "../../../api";
import ButtonWithLoading from "../../../common/components/input/buttons/ButtonWithLoading";
import { coinsToSats } from "../../../common/utils/currencyUtil";
import { OrderSide } from "../../../enums";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";
import { isMarketOrder } from "../tradeUtil";
import PriceWarning from "./PriceWarning";

type PlaceOrderButtonProps = {
  color: "primary" | "secondary";
  contentId: string;
  onClick: () => void;
  onSuccess: () => void;
  onError: (err: any) => void;
  tradeStore?: TradeStore;
};

const PlaceOrderButton = inject(TRADE_STORE)(
  observer(
    (props: PlaceOrderButtonProps): ReactElement => {
      const {
        tradeStore,
        color,
        contentId,
        onClick,
        onSuccess,
        onError,
      } = props;
      const [queryInProgress, setQueryInProgress] = useState(false);
      const [priceWarningVisible, setPriceWarningVisible] = useState(false);
      const [priceOffset, setPriceOffset] = useState(0);

      const buttonText = `${tradeStore!.isBuyActive ? "Buy" : "Sell"} ${
        tradeStore!.baseAsset
      }`;

      const placeOrder = () => {
        setQueryInProgress(true);
        onClick();
        api
          .placeOrder$({
            price: isMarketOrder(tradeStore!.orderType)
              ? undefined
              : Number(tradeStore!.price),
            quantity: Number(coinsToSats(tradeStore!.amount)),
            pairId: tradeStore!.activePair!,
            side: tradeStore!.isBuyActive ? OrderSide.BUY : OrderSide.SELL,
          })
          .subscribe({
            next: () => {
              setQueryInProgress(false);
              onSuccess();
            },
            error: (err) => {
              setQueryInProgress(false);
              onError(err);
            },
          });
      };

      const calculatePriceOffset = (): number => {
        const marketPrice = tradeStore!.isBuyActive
          ? tradeStore!.currentBuyMarketPrice
          : tradeStore!.currentSellMarketPrice;
        if (!tradeStore!.price || !marketPrice) {
          return 0;
        }
        return 100 - (Number(tradeStore!.price) * 100) / marketPrice;
      };

      return (
        <>
          <ButtonWithLoading
            text={buttonText}
            disabled={
              queryInProgress ||
              Number(tradeStore!.amount) === 0 ||
              (!isMarketOrder(tradeStore!.orderType) &&
                Number(tradeStore!.price)) === 0 ||
              !tradeStore!.isAmountValid ||
              !tradeStore?.isTotalValid
            }
            loading={queryInProgress}
            color={color}
            fullWidth
            onClick={() => {
              const offset = calculatePriceOffset();
              setPriceOffset(Number(Math.abs(offset).toFixed(2)));
              if (tradeStore!.isBuyActive ? offset < -2 : offset > 2) {
                setPriceWarningVisible(true);
                return;
              }
              placeOrder();
            }}
          />

          {priceWarningVisible && (
            <PriceWarning
              containerId={contentId}
              priceOffset={priceOffset}
              handleClose={() => setPriceWarningVisible(false)}
              onConfirmed={() => {
                setPriceWarningVisible(false);
                placeOrder();
              }}
            />
          )}
        </>
      );
    }
  )
);

export default PlaceOrderButton;
