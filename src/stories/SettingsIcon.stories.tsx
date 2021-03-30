import React from "react";
import { SettingsIcon } from "../common/components/icons/SettingsIcon";
import { Story, Meta } from "@storybook/react/types-6-0";

export default {
  title: "SettingsIcon",
  component: SettingsIcon,
} as Meta;

const Template: Story = () => <SettingsIcon />;
export const SettingsIconDefault = Template.bind({});
