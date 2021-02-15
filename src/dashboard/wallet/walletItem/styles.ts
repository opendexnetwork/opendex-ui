import styled from "styled-components";
import {
  Card as $Card,
  CardContent as $CardContent,
  Grid
} from "@material-ui/core";

//types
type CardBodyType = {
  item: boolean;
  container: boolean;
  direction: string;
  justify: string;
}

type ViewContentType = {
  item: boolean;
  container: boolean;
  direction: string;
}

type RowsGroupType = {
  key?: string;
  item: boolean;
  container: boolean;
  direction?: string;
  justify?: string;
  spacing?: number;
}

//styled
export const Card = styled($Card)`
  height: 446px;
  min-width: 514px;
`;

export const CardContent = styled($CardContent)`
  padding: ${p => p.theme.spacing(3)}px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const CardBody = styled(Grid)<CardBodyType>`
  height: 100%;
`;

export const ViewContent = styled(Grid)<ViewContentType>`
  padding-top: ${p => p.theme.spacing(3)}px;
`;

export const RowsGroup = styled(Grid)<RowsGroupType>`
  padding-top: ${p => p.theme.spacing(2)}px;
`;