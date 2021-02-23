import React, { ReactElement } from "react";

export const getFormattedTooltipTitle = (
  tooltipTitle: string | string[]
): ReactElement[] | string =>
  typeof tooltipTitle === "string"
    ? tooltipTitle
    : tooltipTitle!.map((row) => <div key={row}>{row}</div>);
