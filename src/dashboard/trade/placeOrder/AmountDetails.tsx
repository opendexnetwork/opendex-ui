import {
  createStyles,
  Grid,
  makeStyles,
  Slider,
  Tooltip,
  Typography,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import { TradeStore, TRADE_STORE } from "../../../stores/tradeStore";

type AmountDetailsProps = {
  onSliderValueChange: () => void;
  color: "primary" | "secondary";
  className?: string;
  tradeStore?: TradeStore;
};

const useStyles = makeStyles(() => {
  return createStyles({
    iconContainer: {
      display: "flex",
      alignItems: "center",
    },
  });
});

const AmountDetails = inject(TRADE_STORE)(
  observer(
    (props: AmountDetailsProps): ReactElement => {
      const { onSliderValueChange, color, className, tradeStore } = props;
      const classes = useStyles();

      const amountMarks = [0, 25, 50, 75, 100];

      const outgoingAsset = tradeStore!.isBuyActive
        ? tradeStore!.quoteAsset
        : tradeStore!.baseAsset;

      const incomingAsset = tradeStore!.isBuyActive
        ? tradeStore!.baseAsset
        : tradeStore!.quoteAsset;

      return (
        <Grid item container wrap="nowrap" spacing={2} className={className}>
          <Grid item container direction="column" xs={4}>
            <Typography>Tradable {tradeStore!.baseAsset}</Typography>
            <Grid item container wrap="nowrap" spacing={1}>
              <Grid item>
                <Typography>
                  Max: {Number(tradeStore!.currentMaxAmount.toFixed(8))}
                </Typography>
              </Grid>
              <Grid item className={classes.iconContainer}>
                <Tooltip
                  title={
                    <>
                      <div>
                        {outgoingAsset} layer 2 balance:{" "}
                        {tradeStore!.channelBalance}
                      </div>
                      <div>
                        {outgoingAsset} max sell: {tradeStore!.sellLimit}
                      </div>
                      <div>
                        {incomingAsset} max buy: {tradeStore!.buyLimit}{" "}
                        {["BTC", "LTC"].includes(incomingAsset!)
                          ? ""
                          : "(auto-extended)"}
                      </div>
                    </>
                  }
                >
                  <InfoIcon fontSize="inherit" />
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Slider
              value={tradeStore!.sliderValue}
              getAriaValueText={(value) => `${value}%`}
              marks={amountMarks.map((mark) => {
                return { value: mark, label: `${mark}%` };
              })}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              color={color}
              onChange={(_e, value) => {
                const val = value as number;
                tradeStore!.setAmount(
                  ((tradeStore!.currentMaxAmount * val) / 100).toString()
                );
                tradeStore!.setSliderValue(val);
                onSliderValueChange();
              }}
            />
          </Grid>
        </Grid>
      );
    }
  )
);

export default AmountDetails;
