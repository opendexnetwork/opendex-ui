import React from "react";
import { LearnIcon } from "../common/components/icons/LearnIcon";
import { Story, Meta } from "@storybook/react/types-6-0";

export default {
  title: "LearnIcon",
  component: LearnIcon,
} as Meta;

const Template: Story = () => <LearnIcon />;
export const LearnIconDefault = Template.bind({});
