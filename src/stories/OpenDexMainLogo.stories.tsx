import React from "react";
import { OpenDexMainLogo } from "../common/components/icons/OpenDexMainLogo";
import { Story, Meta } from "@storybook/react/types-6-0";

export default {
  title: "OpenDexMainLogo",
  component: OpenDexMainLogo,
} as Meta;

const Template: Story = (args) => <OpenDexMainLogo {...args} />;
export const MainLogo = Template.bind({});
