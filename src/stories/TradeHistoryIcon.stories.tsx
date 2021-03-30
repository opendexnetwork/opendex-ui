import React from "react";
import { TradeHistoryIcon } from "../common/components/icons/TradeHistoryIcon";
import { Story, Meta } from "@storybook/react/types-6-0";

export default {
  title: "TradeHistoryIcon",
  component: TradeHistoryIcon,
} as Meta;

const Template: Story = () => <TradeHistoryIcon />;
export const TradeHistoryIconDefault = Template.bind({});
