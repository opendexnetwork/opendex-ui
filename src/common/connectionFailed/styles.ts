import styled from "styled-components";
import { Grid } from "@material-ui/core";

//types
type ContainerType = {
  item: boolean;
  container: boolean;
  direction: string;
  alignItems: string;
  justify: string;
}

//styled
export const Container = styled(Grid)<ContainerType>`
  height: 100vh;
  padding: ${p => p.theme.spacing(3)}px;
`;

export const Row = styled(Grid)`
  padding: ${p => p.theme.spacing(3)}px;
`;