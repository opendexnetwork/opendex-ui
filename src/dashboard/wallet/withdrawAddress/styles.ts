import styled from "styled-components";
import { Grid } from "@material-ui/core";

//types
type ButtonContainerType = {
  item: boolean;
  container: boolean;
  justify: string;
  spacing: number;
}

//styled
export const ButtonContainer = styled(Grid)<ButtonContainerType>`
  margin-top: 1px;
  margin-bottom: ${p => p.theme.spacing(2)}px;
`;