import styled from "styled-components";
import { Grid } from "@material-ui/core";

//types
type RowType = {
  item: boolean;
  container: boolean;
  justify: string;
  alignItems?: string;
}

//styled
export const Row = styled(Grid)<RowType>`
  margin-top: ${p => p.theme.spacing(2)}px;
`;