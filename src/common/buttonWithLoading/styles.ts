import styled from "styled-components";
import { CircularProgress } from "@material-ui/core";

//types
type ButtonProgressType = {
  size: number;
}

//styled
export const ButtonWrapper = styled.div`
  position: relative;
`;

export const ButtonProgress = styled(CircularProgress)<ButtonProgressType>`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;