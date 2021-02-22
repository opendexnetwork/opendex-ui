import {
  Button as MaterialButton,
  ButtonProps,
  Tooltip,
} from "@material-ui/core";
import React, { ReactElement } from "react";
import { getFormattedTooltipTitle } from "../../../utils/uiUtil";

export type ButtonBaseProps = ButtonProps & {
  text: string;
  tooltipTitle?: string | string[];
  tooltipPlacement?: "left" | "right" | "bottom" | "top";
};

const ButtonBase = (props: ButtonBaseProps): ReactElement => {
  const { text, tooltipTitle, tooltipPlacement } = props;

  const materialButtonProps: ButtonProps = {
    ...props,
    disableElevation: true,
    children: text,
  };

  return (
    <>
      {tooltipTitle ? (
        <Tooltip
          title={getFormattedTooltipTitle(tooltipTitle)}
          placement={tooltipPlacement}
        >
          <MaterialButton {...materialButtonProps} />
        </Tooltip>
      ) : (
        <MaterialButton {...materialButtonProps} />
      )}
    </>
  );
};

export default ButtonBase;
