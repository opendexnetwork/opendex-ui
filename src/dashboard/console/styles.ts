import styled from "styled-components";
import { Typography } from "@material-ui/core";

// types
type TitleType = {
  component: string;
  variant: string;
}

//styled
export const Wrapper = styled.div`
  flex: 1;
`;

export const Title = styled(Typography)<TitleType>`
  margin-bottom: ${p => p.theme.spacing(2)}px;
`;

export const Code = styled.span`
  background-color: ${p => p.theme.palette.background.paper};
  padding: ${p => `0px ${p.theme.spacing(1)}px`};
  border-radius: 5px;
  letter-spacing: 2px;
  font-family: monospace;
`;

export const TerminalContainer = styled.div`
  height: 90%;
  width: 100%;
  overflowY: auto;
`;