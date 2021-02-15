import { Button } from "@material-ui/core";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import React, { ReactElement } from "react";
import { formatDateTimeForFilename } from "../../../common/dateUtil";
import { TradeHeader, TradeRow } from "..";

//styles
import {
  DownloadButtonContainer,
  DownloadLink
} from "./styles";

export type TradehistoryDownloadProps = {
  rows: TradeRow[];
  headers: TradeHeader[];
};

const TradehistoryDownload = (
  props: TradehistoryDownloadProps
): ReactElement => {
  const { headers, rows } = props;

  return (
    <DownloadButtonContainer
      item
      container
      justify="flex-end"
    >
      <DownloadLink
        data={rows}
        headers={headers}
        filename={`tradehistory_${formatDateTimeForFilename(new Date())}.csv`}
      >
        <Button variant="contained" startIcon={<GetAppOutlinedIcon />}>
          Download (.csv)
        </Button>
      </DownloadLink>
    </DownloadButtonContainer>
  );
};

export default TradehistoryDownload;
