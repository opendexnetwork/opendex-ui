import styled from "styled-components";
import { Grid } from "@material-ui/core";

//types
type ContainerType = {
  container: boolean;
  justify: string;
}

type ErrorMessageContainerType = {
  item: boolean;
  container: boolean;
  direction: string;
  alignItems: string;
}

//styled
export const Container = styled(Grid)<ContainerType>`
  height: 50vh;
  max-height: 500px;
`;

export const ErrorMessageContainer = styled(Grid)<ErrorMessageContainerType>`
  min-height: 50px;
  margin-top: ${p => p.theme.spacing(2)}px;
`;