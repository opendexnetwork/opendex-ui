import styled from "styled-components";
import { Grid } from "@material-ui/core";
import CSVLink from "../../../common/csv/CsvLink";

//types
type DownloadButtonContainerType = {
  item: boolean;
  container: boolean;
  justify: string;
}

type DownloadLinkType = {
  data: any;
  headers: any;
  filename: string;
}

//styled
export const DownloadButtonContainer = styled(Grid)<DownloadButtonContainerType>`
  padding-top: ${p => p.theme.spacing(3)}px;
`;

export const DownloadLink = styled(CSVLink)<DownloadLinkType>`
  text-decoration: none;
`;