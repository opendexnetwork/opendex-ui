import React from "react";
import { TradeIcon } from "../common/components/icons/TradeIcon";
import { Story, Meta } from "@storybook/react/types-6-0";

export default {
  title: "TradeIcon",
  component: TradeIcon,
} as Meta;

const Template: Story = () => <TradeIcon />;
export const TradeIconDefault = Template.bind({});
