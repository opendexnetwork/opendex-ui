import styled from "../../dashboard/unlockOpendexd/node_modules/styled-components";
import { CircularProgress } from "../../dashboard/unlockOpendexd/node_modules/@material-ui/core";

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