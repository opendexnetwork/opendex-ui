import { createMuiTheme } from "@material-ui/core";

const defaultTheme = createMuiTheme();

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: defaultTheme.palette.primary.light,
    },
  },
});

export const tradeTheme = createMuiTheme({
  palette: {
    primary: {
      main: defaultTheme.palette.success.light,
    },
    type: "dark",
  },
});
