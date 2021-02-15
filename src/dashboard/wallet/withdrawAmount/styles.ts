import styled from "styled-components";
import { Typography } from "@material-ui/core";

//types
type RowType = {
  variant: string;
  color?: string;
  align: string;
}

//styled
export const Row = styled(Typography)<RowType>`
  padding: ${p => p.theme.spacing(2)}px 0px;
`;