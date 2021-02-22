import { ReactElement } from "react";
import ButtonBase, { ButtonBaseProps } from "./ButtonBase";

type TextButtonProps = Omit<ButtonBaseProps, "variant">;

const TextButton = (props: TextButtonProps): ReactElement => {
  const buttonBaseProps: ButtonBaseProps = {
    ...props,
    variant: "text",
  };
  return ButtonBase(buttonBaseProps);
};

export default TextButton;
