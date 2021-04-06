import {
  CircularProgress,
  FormControl,
  FormHelperText,
  makeStyles,
  Theme,
} from "@material-ui/core";
import React, { ReactElement } from "react";
import Button from "./Button";

type ButtonWithLoadingProps = {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  loading?: boolean;
  submitButton?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary";
  error?: boolean;
  helperText?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  button: (props: ButtonWithLoadingProps) => ({
    borderRadius: "initial",
    padding: "12px",
    fontSize: "16px",
    color: "#0c0c0c",

    "&.Mui-disabled": {
      color: "#0c0c0c",
      backgroundColor:
        props.color === "primary"
          ? theme.palette.primary.main
          : theme.palette.secondary.main,
      opacity: 0.5,
    },
  }),
  buttonWrapper: {
    position: "relative",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const ButtonWithLoading = (props: ButtonWithLoadingProps): ReactElement => {
  const classes = useStyles(props);
  const {
    onClick,
    text,
    disabled,
    loading,
    submitButton,
    fullWidth,
    size,
    color,
    error,
    helperText,
  } = props;

  return (
    <FormControl fullWidth={fullWidth}>
      <div className={classes.buttonWrapper}>
        <Button
          className={classes.button}
          text={text}
          type={submitButton ? "submit" : "button"}
          color={color || "primary"}
          onClick={onClick}
          disabled={disabled}
          fullWidth={fullWidth}
          size={size}
        />
        {loading && (
          <CircularProgress
            size={24}
            className={classes.buttonProgress}
            color={color || "primary"}
          />
        )}
      </div>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default ButtonWithLoading;
