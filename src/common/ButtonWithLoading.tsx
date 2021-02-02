import {
  Button,
  CircularProgress,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import React, { ReactElement } from "react";

type ButtonWithLoadingProps = {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  loading?: boolean;
  submitButton?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary";
};

const useStyles = makeStyles(() =>
  createStyles({
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
  })
);

const ButtonWithLoading = (props: ButtonWithLoadingProps): ReactElement => {
  const classes = useStyles();
  const {
    onClick,
    text,
    disabled,
    loading,
    submitButton,
    fullWidth,
    size,
    color,
  } = props;

  return (
    <div className={classes.buttonWrapper}>
      <Button
        type={submitButton ? "submit" : "button"}
        color={color || "primary"}
        disableElevation
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        fullWidth={fullWidth}
        size={size}
      >
        {text}
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};

export default ButtonWithLoading;
