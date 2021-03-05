import Button, { ButtonProps } from "../common/components/input/buttons/Button";
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

export default {
  title: "Button",
  component: Button,
  argTypes: {
    text: { defaultValue: "I'm a Button" },
  },
} as Meta;

const Template: Story<ButtonProps> = (args: ButtonProps) => (
  <Button {...args} />
);

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  color: "primary",
};

export const OutlinedButton = Template.bind({});
OutlinedButton.args = {
  color: "default",
  variant: "outlined",
};
