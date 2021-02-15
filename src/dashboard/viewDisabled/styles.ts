import styled from "styled-components";
import { Grid } from "@material-ui/core";

//types
type RowType = {
  container: boolean;
  item: boolean;
  alignItems?: string;
  justify: string;
  spacing?: number;
}

//styled
export const Row = styled(Grid)<RowType>`
  padding: ${p => p.theme.spacing(3)}px;
`;