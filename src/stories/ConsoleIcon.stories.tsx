import React from "react";
import { ConsoleIcon } from "../common/components/icons/ConsoleIcon";
import { Story, Meta } from "@storybook/react/types-6-0";

export default {
  title: "ConsoleIcon",
  component: ConsoleIcon,
} as Meta;

const Template: Story = () => <ConsoleIcon />;
export const ConsoleIconDefault = Template.bind({});
