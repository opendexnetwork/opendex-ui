import { ReactElement } from "react";
import ButtonBase, { ButtonBaseProps } from "./ButtonBase";

type ButtonProps = Omit<ButtonBaseProps, "variant"> & {
  variant?: "contained" | "outlined";
};

const Button = (props: ButtonProps): ReactElement => {
  const buttonBaseProps: ButtonBaseProps = {
    ...props,
    variant: props.variant || "contained",
  };
  return ButtonBase(buttonBaseProps);
};

export default Button;
