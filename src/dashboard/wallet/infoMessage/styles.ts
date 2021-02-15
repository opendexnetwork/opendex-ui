import styled from "styled-components";
import { Card as $Card } from "@material-ui/core";

//types
type CardType = {
  elevation: number;
}

//styled
export const Card = styled($Card)<CardType>`
  background-color: ${p => p.theme.palette.info.main};
  color: ${p => p.theme.palette.info.contrastText};
  margin-top: ${p => p.theme.spacing(3)}px;
  padding: ${p => p.theme.spacing(1)}px;
  width: 100%;
`;