import React from "react";
import { WalletIcon } from "../common/components/icons/WalletIcon";
import { Story, Meta } from "@storybook/react/types-6-0";

export default {
  title: "WalletIcon",
  component: WalletIcon,
} as Meta;

const Template: Story = () => <WalletIcon />;
export const WalletIconDefault = Template.bind({});
