import React from "react";
import { storiesOf } from "@storybook/react";
import { ConsoleIcon } from "../common/components/icons/ConsoleIcon";
import { LearnIcon } from "../common/components/icons/LearnIcon";
import { MMBotIcon } from "../common/components/icons/MMBotIcon";
import { OverviewIcon } from "../common/components/icons/OverviewIcon";
import { SettingsIcon } from "../common/components/icons/SettingsIcon";
import { TradeHistoryIcon } from "../common/components/icons/TradeHistoryIcon";
import { TradeIcon } from "../common/components/icons/TradeIcon";
import { WalletIcon } from "../common/components/icons/WalletIcon";

storiesOf("Menu Icons", module)
  .add("Overview Icon", () => <OverviewIcon />)
  .add("MMBot Icon", () => <MMBotIcon />)
  .add("Trade Icon", () => <TradeIcon />)
  .add("Trade History Icon", () => <TradeHistoryIcon />)
  .add("Wallet Icon", () => <WalletIcon />)
  .add("Console Icon", () => <ConsoleIcon />)
  .add("Learn Icon", () => <LearnIcon />)
  .add("Settings Icon", () => <SettingsIcon />);
