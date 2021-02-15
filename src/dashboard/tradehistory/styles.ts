import styled from "styled-components";
import { Grid } from "@material-ui/core";

//types
type ContentType = {
  container: boolean;
  direction: string;
}

//styled
export const Content = styled(Grid)<ContentType>`
  flex: 1;
  overflow-y: auto;
  flex-wrap: nowrap;
`;