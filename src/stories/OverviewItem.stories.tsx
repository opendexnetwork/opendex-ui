import React from "react";
import { storiesOf } from "@storybook/react";
import OverviewItem from "../dashboard/overview/OverviewItem";

export type Status = {
  service: string;
  status: string;
};

storiesOf("Overview", module).add("OverviewItem", () => (
  <OverviewItem
    opendexdLocked={false}
    opendexdNotReady={false}
    status={{
      service: "lndbtc",
      status: "Synced 100%. Waiting for wallet creation.",
    }}
  />
));
