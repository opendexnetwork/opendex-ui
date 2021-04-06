import {
  createStyles,
  withStyles,
  Grid,
  makeStyles,
  Slider,
  Tooltip,
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
      color: "#979797",
      display: "flex",
      alignItems: "center",
      fontSize: "16px",
    },
    text: {
      color: "#979797",
      fontSize: "16px",
      padding: "2px 0",
    },
    textHighlighted: {
      color: "#f2f2f2",
    },
    toolTip: {
      color: "#f2f2f2",
      backgroundColor: "#0c0c0c",
      fontSize: "13px",
    },
  });
});

const CustomSlider = withStyles({
  root: {
    padding: "8px 0",
  },
  thumb: {
    height: "19px",
    width: "19px",
    border: "2px solid #f2f2f2",
  },
  track: {
    height: 4,
    zIndex: 9999,
  },
  rail: {
    height: 2,
    color: "#636363",
    opacity: "1",
  },
  mark: {
    height: "10px",
    width: "1px",
    color: "#636363",
    "&[data-index='0']": {
      display: "none",
    },
    "&[data-index='4']": {
      display: "none",
    },
  },
  markLabel: {
    color: "#636363",
    fontSize: "12px",
    paddingTop: "4px",
    "&[data-index='0']": {
      paddingLeft: "8px",
    },
    "&[data-index='4']": {
      paddingRight: "30px",
    },
  },
  markLabelActive: {
    color: "#f2f2f2",
  },
})(Slider);

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
            <span className={classes.text}>
              Tradable {tradeStore!.baseAsset}
            </span>
            <Grid item container wrap="nowrap" spacing={1}>
              <Grid item>
                <span className={classes.text}>
                  Max:{" "}
                  <span className={classes.textHighlighted}>
                    {Number(tradeStore!.currentMaxAmount.toFixed(8))}{" "}
                    {tradeStore!.baseAsset}
                  </span>
                </span>
              </Grid>
              <Grid item className={classes.iconContainer}>
                <Tooltip
                  classes={{
                    tooltip: classes.toolTip,
                  }}
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
            <CustomSlider
              value={tradeStore!.sliderValue}
              getAriaValueText={(value) => `${value}%`}
              marks={amountMarks.map((mark) => {
                return {
                  value: mark,
                  label: mark !== 25 && mark !== 75 ? `${mark}%` : "",
                };
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
