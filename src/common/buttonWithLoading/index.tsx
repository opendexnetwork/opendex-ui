import { Button } from "@material-ui/core";
import React, { ReactElement } from "react";

//styles
import {
  ButtonWrapper,
  ButtonProgress
} from "./styles";

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

const ButtonWithLoading = (props: ButtonWithLoadingProps): ReactElement => {
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
    <ButtonWrapper>
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
        <ButtonProgress size={24} />
      )}
    </ButtonWrapper>
  );
};

export default ButtonWithLoading;
