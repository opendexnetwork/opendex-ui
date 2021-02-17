import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import React, { ReactElement } from "react";
import { satsToCoinsStr } from "../../common/utils/currencyUtil";
import Balance from "../../models/Balance";
import WalletRow, { WalletSubrow } from "./WalletRow";

type BalanceSummaryProps = {
  balance: Balance;
};

const BalanceSummary = (props: BalanceSummaryProps): ReactElement => {
  const { balance } = props;
  const offChainSubrows: WalletSubrow[] = [];
  const onChainSubrows: WalletSubrow[] = [];

  const addToRowsIfNotZero = (
    rows: WalletSubrow[],
    value: string | number,
    label: string
  ): void => {
    if (Number(value)) {
      rows.push({
        label: label,
        value: satsToCoinsStr(value),
      });
    }
  };

  addToRowsIfNotZero(
    offChainSubrows,
    balance.pending_channel_balance,
    "pending"
  );
  addToRowsIfNotZero(
    offChainSubrows,
    balance.inactive_channel_balance,
    "inactive"
  );
  addToRowsIfNotZero(
    onChainSubrows,
    balance.unconfirmed_wallet_balance,
    "pending"
  );

  return (
    <>
      <WalletRow
        label="Layer 1"
        subrows={onChainSubrows}
        value={satsToCoinsStr(balance.wallet_balance)}
        labelItem={
          <Tooltip title="on-chain, not tradable">
            <InfoIcon fontSize="inherit" />
          </Tooltip>
        }
      />
      <WalletRow
        label="Layer 2"
        value={satsToCoinsStr(balance.channel_balance)}
        subrows={offChainSubrows}
        labelItem={
          <Tooltip title="off-chain, tradable">
            <InfoIcon fontSize="inherit" />
          </Tooltip>
        }
      />
      <WalletRow label="Total" value={satsToCoinsStr(balance.total_balance)} />
    </>
  );
};

export default BalanceSummary;
