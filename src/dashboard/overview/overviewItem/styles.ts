import styled from "styled-components";
import {
  Grid,
  CardContent as $CardContent,
  Snackbar as $Snackbar,
  SnackbarContent as $SnackbarContent,
} from "@material-ui/core";

//type
type StyledGridType = {
  container: boolean;
  justify: string;
  alignItems: string;
  wrap: string;
};

type CardCellGridType = {
  item: boolean;
  xs: number
};

type StatusDotType = {
  isServiceReady: boolean;
}

type SnackbarType = {
  open: boolean;
  autoHideDuration: number;
  onClose: () => void;
  anchorOrigin: object;
}

type SnackbarContentType = {
  message: string;
  action: any;
}

//styled
export const StyledGrid = styled(Grid)<StyledGridType>`
  padding: ${p => p.theme.spacing(3)}px;
`;

export const CardContent = styled($CardContent)`
  padding: 0px;
  &:last-child {
    padding-bottom: 0px;
  }
`;

export const CardCellGrid = styled(Grid)<CardCellGridType>`
  padding: ${p => p.theme.spacing(4)}px;
  text-align: center;
`;

export const StatusDot = styled.span<StatusDotType>`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 10px;
  background-color: ${p => p.isServiceReady ? p.theme.palette.success.light : p.theme.palette.error.light};
`;

export const Snackbar = styled($Snackbar)<SnackbarType>`
  bottom: ${p => p.theme.spacing(3) * 2}px;
  right: ${p => p.theme.spacing(3) * 2}px;
`;

export const SnackbarContent = styled($SnackbarContent)<SnackbarContentType>`
  background-color: ${p => p.theme.palette.error.main};
  color: ${p => p.theme.palette.error.contrastText};
`;