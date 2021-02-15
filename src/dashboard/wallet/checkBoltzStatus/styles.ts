import styled from "styled-components";
import {
  Grid,
  Typography
} from "@material-ui/core";

//types
type RowType = {
  item: boolean;
  container: boolean;
  justify: string;
}

type CodeType = {
  component: string;
  variant: string;
}

type IconContainterType = {
  item: boolean;
}

//styled
export const Row = styled(Grid)<RowType>`
  padding-top: ${p => p.theme.spacing(1)}px;
`;

export const Code = styled(Typography)<CodeType>`
  background-color: ${p => p.theme.palette.background.default};
  padding: ${p => p.theme.spacing(1)}px;
  border-radius: 5px;
  letter-spacing: 2px;
  font-family: monospace;
`;

export const IconContainer = styled(Grid)<IconContainterType>`
  display: flex;
  align-items: center;
`;