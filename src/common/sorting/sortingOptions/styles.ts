import styled from "styled-components";
import {
  Button,
  Grid,
  Paper,
  Typography
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

//types
type SortIconContainerType = {
  item: boolean;
  container: boolean;
  justify: string;
}

type SortOptionButtonType = {
  fullWidth: boolean;
  disableRipple: boolean;
  size: string;
  onClick: () => void;
  key: string;
}

type SortOptionActiveGridType = {
  item: boolean;
  container: boolean;
  alignItems: string;
  spacing: number;
  wrap: string;
  sortOptionActive: boolean;
}

type SortDirIconContainerType = {
  component: string;
}

//styled
export const SortIconContainer = styled(Grid)<SortIconContainerType>`
  padding-top: ${p => p.theme.spacing(2)}px;
`;

export const SortOptionsMenu = styled(Paper)`
  background-color: ${p => p.theme.palette.background.default};
`;

export const SortOptionButton = styled(Button)<SortOptionButtonType>`
  padding: ${p => `${p.theme.spacing(1)}px ${p.theme.spacing(3)}px`}; 
  text-transform: none;
  border-radius: 0px;
  color: ${p => p.theme.palette.text.secondary};
`;

export const SortOptionActiveGrid = styled(Grid)<SortOptionActiveGridType>`
  ${p => p.sortOptionActive && `
    font-weight: ${p.theme.typography.fontWeightBold};
    color: ${p.theme.palette.text.primary};
  `}
`;

export const SortDirIconContainer = styled(Typography)<SortDirIconContainerType>`
  width: 15px;
`;

export const StyledArrowDownwardIcon = styled(ArrowDownwardIcon)`
  ${p => getArrowIconStyles(p)}
`;

export const StyledArrowUpwardIcon = styled(ArrowUpwardIcon)`
  ${p => getArrowIconStyles(p)}
`;

const getArrowIconStyles = (p: any) => {
  return `
    font-size: ${p.theme.typography.body2.fontSize};
  `;
}