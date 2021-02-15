import styled from "styled-components";
import {
  Drawer,
  List,
  Typography,
  Button
} from "@material-ui/core";
import { ReactElement } from "react";
const drawerWidth = 200;

//types
type DrawerPaperType = {
  variant: string;
  anchor: string;
}

type HeaderType = {
  variant: string;
  component: string;
  color: string;
}

type DrawerButtonType = {
  size: string;
  startIcon: ReactElement;
  variant: string;
  onClick: () => void;
}

//styled
export const DrawerPaper = styled(Drawer)<DrawerPaperType>`
  & > .MuiPaper-root {
    width: ${drawerWidth}px;
    justify-content: space-between;
  }
`;

export const MenuContainer = styled(List)`
  width: 100%;
`;

export const Header = styled(Typography)<HeaderType>`
  padding: 16px;
`;

export const DrawerButton = styled(Button)<DrawerButtonType>`
  margin: ${p => p.theme.spacing(2)}px;
`;

export const Content = styled.main`
  margin-left: ${drawerWidth}px;
  background-color: ${p => p.theme.palette.background.default};
  padding: ${p => p.theme.spacing(3)}px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;