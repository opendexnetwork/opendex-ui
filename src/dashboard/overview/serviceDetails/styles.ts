import styled from "styled-components";
import { Dialog as $Dialog} from "@material-ui/core";
const drawerWidth = 200;

export const Dialog = styled($Dialog)`
  & > .MuiDialog-container > .MuiPaper-root {
    position: absolute;
    left: ${drawerWidth}px;
    top: 0px;
    margin: ${p => p.theme.spacing(3)}px;
    width: 100%;
    max-width: calc(100% - ${p => (drawerWidth + p.theme.spacing(3) * 2)}px);
    background-color: ${p => p.theme.palette.background.default};
  }
`;