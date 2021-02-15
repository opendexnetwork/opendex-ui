import styled from "styled-components";
import { Grid } from "@material-ui/core";

//types
type LoaderContainerType = {
  container: boolean;
}

//styled
export const LoaderContainer = styled(Grid)<LoaderContainerType>`
  height: 100px;
  justify-content: center;
  align-items: center;
`;