import React from "react";
import { MMBotIcon } from "../common/components/icons/MMBotIcon";
import { Story, Meta } from "@storybook/react/types-6-0";

export default {
  title: "MMBotIcon",
  component: MMBotIcon,
} as Meta;

const Template: Story = () => <MMBotIcon />;
export const MMBotIconnDefault = Template.bind({});
