import { createMuiTheme } from "@material-ui/core";

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
  overrides: {
    MuiFormLabel: {
      root: {
        color: "#979797",
        "&$focused": {
          color: "#979797",
        },
      },
    },
    MuiInput: {
      underline: {
        borderBottom: "1px solid #333333",
        "&:after": {
          borderBottom: "1px solid #333333",
          borderBottomStyle: "none",
        },
        "&:before": {
          borderBottom: "1px solid #333333",
          borderBottomStyle: "none",
        },

        "&&&:before": {
          borderBottomStyle: "none",
        },
        "&&:after": {
          borderBottomStyle: "none",
        },
      },
    },
    MuiInputBase: {
      input: {
        "&:-webkit-autofill": {
          transitionDelay: "9999s",
          transitionProperty: "background-color, color",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#29cc78",
    },
    secondary: {
      main: "#e63939",
    },
    type: "dark",
  },
});
