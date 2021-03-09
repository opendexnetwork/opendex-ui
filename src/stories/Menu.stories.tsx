import React from "react";
import StoryRouter from "storybook-react-router";
import { storiesOf } from "@storybook/react";
import { Menu } from "../common/components/navigation/Menu";

storiesOf("Menu", module)
  .addDecorator(StoryRouter())
  .add("MenuDefault", () => (
    <Menu syncInProgress={false} menuItemTooltipMsg={[]} />
  ));
