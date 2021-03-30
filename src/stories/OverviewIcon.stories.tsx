import React from "react";
import { OverviewIcon } from "../common/components/icons/OverviewIcon";
import { Story, Meta } from "@storybook/react/types-6-0";

export default {
  title: "OverviewIcon",
  component: OverviewIcon,
} as Meta;

const Template: Story = () => <OverviewIcon />;
export const OverviewIconDefault = Template.bind({});
