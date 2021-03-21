import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { addDecorator } from "@storybook/react";
import { withThemes } from "@react-theming/storybook-addon";
import { darkTheme } from "../src/themes";
import storybookTheme from "./theme";

const providerFn = ({ theme, children }) => {
  const muTheme = createMuiTheme(theme);
  return <ThemeProvider theme={muTheme}>{children}</ThemeProvider>;
};

addDecorator(withThemes(null, [darkTheme], { providerFn }));

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  docs: {
    theme: storybookTheme,
  },
  layout: 'centered',
};
