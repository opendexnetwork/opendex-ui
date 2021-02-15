import styled from "styled-components";
import { Paper } from "@material-ui/core";

export const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${p => p.theme.palette.background.default};
  padding: ${p => p.theme.spacing(2)}px;
`;