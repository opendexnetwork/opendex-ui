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
  const { text, tooltipTitle, tooltipPlacement, ...buttonProps } = props;

  const materialButtonProps: ButtonProps = {
    disableElevation: true,
    children: text,
    ...buttonProps,
  };

  return (
    <>
      {tooltipTitle ? (
        <Tooltip
          title={getFormattedTooltipTitle(tooltipTitle)}
          placement={tooltipPlacement}
        >
          <span>
            <MaterialButton {...materialButtonProps} />
          </span>
        </Tooltip>
      ) : (
        <MaterialButton {...materialButtonProps} />
      )}
    </>
  );
};

export default ButtonBase;
