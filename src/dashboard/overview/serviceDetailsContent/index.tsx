import {
  CircularProgress,
  Divider,
  Grid
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import React, { ReactElement, useEffect, useState } from "react";
import { Subscription } from "rxjs";
import api from "../../../api";
import { SERVICES_WITH_ADDITIONAL_INFO } from "../../../constants";
import { Info } from "../../../models/Info";
import { LndInfo } from "../../../models/LndInfo";
import { Status } from "../../../models/Status";
import { copyToClipboard } from "../../../common/appUtil";

//styles
import {
  DialogContent,
  GridCell,
  TextRow,
  LoadedContainer
} from "./styles";

export type ServiceDetailsContentProps = {
  status: Status;
  closeDetails: () => void;
};

type InfoRow = {
  label: string;
  value: string | number;
  copyIcon?: boolean;
};

const fetchInfo = (
  onNext: (value: Info) => void,
  closeDetails: () => void
): Subscription => {
  return api.getinfo$().subscribe({
    next: onNext,
    error: closeDetails,
  });
};

const createRows = (info: Info, status: Status): InfoRow[] => {
  if (status.service === "xud") {
    return createXudRows(status, info);
  }
  if (status.service === "connext") {
    return createConnextRows(info);
  }
  if (status.service.startsWith("lnd")) {
    const currency = status.service === "lndbtc" ? "BTC" : "LTC";
    const lndInfo: LndInfo = info.lnd[currency];
    return createLndRows(lndInfo);
  }
  return [];
};

const createXudRows = (status: Status, info: Info): InfoRow[] => [
  { label: "Status", value: status.status },
  { label: "Alias", value: info.alias },
  {
    label: "NodeKey",
    value: info.node_pub_key,
    copyIcon: !!info.node_pub_key,
  },
  {
    label: "Address",
    value: info.uris?.length ? info.uris[0] : "",
    copyIcon: !!info.uris?.length,
  },
  { label: "Network", value: info.network },
  { label: "Peers", value: info.num_peers },
  { label: "Pairs", value: info.num_pairs },
  { label: "Own orders", value: info.orders.own },
  { label: "Peers' orders", value: info.orders.peer },
  { label: "Pending swaps", value: info.pending_swap_hashes?.join("\n") },
];

const createConnextRows = (info: Info): InfoRow[] => [
  { label: "Status", value: info.connext.status },
  {
    label: "Address",
    value: info.connext.address,
    copyIcon: !!info.connext.address,
  },
  { label: "Version", value: info.connext.version },
  { label: "Chain", value: info.connext.chain },
];

const createLndRows = (lndInfo: LndInfo): InfoRow[] => [
  { label: "Status", value: lndInfo.status },
  { label: "Alias", value: lndInfo.alias },
  {
    label: "Address",
    value: lndInfo.uris?.length ? lndInfo.uris[0] : "",
    copyIcon: !!lndInfo.uris?.length,
  },
  {
    label: "Chains",
    value: (lndInfo.chains || [])
      .map((chain) => `${chain.chain} ${chain.network}`)
      .join("\n"),
  },
  { label: "Blockheight", value: lndInfo.blockheight },
  { label: "Active channels", value: lndInfo.channels?.active },
  { label: "Inactive channels", value: lndInfo.channels?.inactive },
  { label: "Pending channels", value: lndInfo.channels?.pending },
  { label: "Closed channels", value: lndInfo.channels?.closed },
  { label: "Version", value: lndInfo.version },
];

const ServiceDetailsContent = (
  props: ServiceDetailsContentProps
): ReactElement => {
  const { status, closeDetails } = props;
  const [rows, setRows] = useState<InfoRow[]>([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (!SERVICES_WITH_ADDITIONAL_INFO.includes(status.service)) {
      return;
    }
    const onNextValue = (value: Info): void => {
      setRows(createRows(value, status));
      setInitialLoadComplete(true);
    };
    const subscription = fetchInfo(onNextValue, closeDetails);
    return () => subscription.unsubscribe();
  }, [closeDetails, status]);

  return (
    <DialogContent>
      {initialLoadComplete ? (
        rows?.map((row) => (
          <Grid
            key={row.label}
            container
            item
            justify="space-between"
            alignItems="center"
          >
            <GridCell item xs={3} md={2}>
              <strong>{row.label}</strong>
            </GridCell>
            <Divider orientation="vertical" flexItem />
            <GridCell item xs={6} md={8}>
              {row.value}
            </GridCell>
            <GridCell item xs={2} md={1}>
              {row.copyIcon && (
                <IconButton onClick={() => copyToClipboard(row.value)}>
                  <FileCopyOutlinedIcon fontSize="small" />
                </IconButton>
              )}
            </GridCell>
          </Grid>
        ))
      ) : (
        <LoadedContainer container>
          <CircularProgress color="inherit" />
        </LoadedContainer>
      )}
      {!rows?.length &&
        !SERVICES_WITH_ADDITIONAL_INFO.includes(status.service) && (
          <TextRow variant="body1" component="p">
            No additional information to display
          </TextRow>
        )}
    </DialogContent>
  );
};

export default ServiceDetailsContent;
