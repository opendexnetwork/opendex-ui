import { createMuiTheme } from "@material-ui/core";

const defaultTheme = createMuiTheme();

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#f45c24",
    },
    background: {
      default: "#0c0c0c",
      paper: "#151515",
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
