import styled from "styled-components";
import {
  DialogContent as $DialogContent,
  Grid,
  Typography
} from "@material-ui/core";

//types
type GridCellType = {
  item: boolean;
  xs: number;
  md: number;
};

type TextRowType = {
  variant: string;
  component: string;
}

type LoadedContainerType = {
  container: boolean;
}

//styled
export const DialogContent = styled($DialogContent)`
  padding: 0px;
`;

export const GridCell = styled(Grid)<GridCellType>`
  padding: ${p => p.theme.spacing(2)}px;
  text-align: center;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

export const TextRow = styled(Typography)<TextRowType>`
  padding: ${p => p.theme.spacing(3)}px;
  text-align: center;
`;

export const LoadedContainer = styled(Grid)<LoadedContainerType>`
  height: 100px;
  justify-content: center;
  align-items: center;
`;