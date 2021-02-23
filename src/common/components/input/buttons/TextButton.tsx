import { ReactElement } from "react";
import ButtonBase, { ButtonBaseProps } from "./ButtonBase";

type TextButtonProps = Omit<ButtonBaseProps, "variant">;

const TextButton = (props: TextButtonProps): ReactElement => {
  const buttonBaseProps: ButtonBaseProps = {
    variant: "text",
    ...props,
  };
  return ButtonBase(buttonBaseProps);
};

export default TextButton;
