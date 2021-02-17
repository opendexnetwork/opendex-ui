import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import React, { ReactElement } from "react";
import { satsToCoinsStr } from "../../common/utils/currencyUtil";
import { TradingLimits } from "../../models/TradingLimits";
import WalletRow from "./WalletRow";

type LimitsSummaryProps = {
  limits: TradingLimits;
  currency: string;
};

const LimitsSummary = (props: LimitsSummaryProps): ReactElement => {
  const { limits, currency } = props;

  const getLimitsRow = (buy: boolean): ReactElement => {
    const label = `Max ${buy ? "buy" : "sell"}`;
    const hints = [];
    const reserved = Number(buy ? limits.reserved_buy : limits.reserved_sell);
    if (reserved) {
      hints.push(`in orders: ${satsToCoinsStr(reserved)}`);
    }
    if (buy && !["BTC", "LTC"].includes(currency)) {
      hints.push("auto-extended");
    }

    return (
      <WalletRow
        label={label}
        value={satsToCoinsStr(buy ? limits.max_buy : limits.max_sell)}
        labelItem={
          !!hints.length && (
            <Tooltip
              title={hints.map((hint) => (
                <div key={hint}>{hint}</div>
              ))}
            >
              <InfoIcon fontSize="inherit" />
            </Tooltip>
          )
        }
      />
    );
  };

  return (
    <>
      {getLimitsRow(true)}
      {getLimitsRow(false)}
    </>
  );
};

export default LimitsSummary;
