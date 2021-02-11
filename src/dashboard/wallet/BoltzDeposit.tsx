import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { combineLatest, Observable, Subject } from "rxjs";
import api from "../../api";
import { satsToCoinsStr } from "../../common/currencyUtil";
import { getErrorMsg } from "../../common/errorUtil";
import QrCode from "../../common/QrCode";
import WarningMessage from "../../common/WarningMessage";
import { DepositResponse } from "../../models/DepositResponse";
import { GetServiceInfoResponse } from "../../models/GetServiceInfoResponse";
import { Info } from "../../models/Info";
import Address from "./Address";
import BoltzFeeInfo from "./BoltzFeeInfo";
import CheckBoltzTransactionStatus from "./CheckBoltzTransactionStatus";

type BoltzDepositProps = {
  currency: string;
  refreshSubject: Subject<void>;
  getInfo$: Observable<Info>;
  setError: (value: string) => void;
  setFetchingData: (value: boolean) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      paddingTop: theme.spacing(2),
    },
  })
);

const getAvgMinutesBetweenBlocks = (
  start: number,
  end: number,
  currency: string
): number | null => {
  const diff = end - start;
  if (currency === "BTC") {
    return diff * 10;
  }
  if (currency === "LTC") {
    return Math.round(diff * 2.5);
  }
  return null;
};

const getTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  const hoursStr = hours ? `${hours} hours` : "";
  const minutesStr = remainingMins ? `${remainingMins} minutes` : "";
  return [hoursStr, minutesStr].join(" ");
};

const BoltzDeposit = (props: BoltzDepositProps): ReactElement => {
  const {
    currency,
    refreshSubject,
    getInfo$,
    setError,
    setFetchingData,
  } = props;
  const classes = useStyles();

  const [depositData, setDepositData] = useState<DepositResponse | undefined>(
    undefined
  );
  const [serviceInfo, setServiceInfo] = useState<
    GetServiceInfoResponse | undefined
  >(undefined);
  const [currentBlockHeight, setCurrentBlockHeight] = useState<
    number | undefined
  >(undefined);
  const [qrOpen, setQrOpen] = useState(false);
  const [addressAutoUpdated, setAddressAutoUpdated] = useState(false);

  useEffect(() => {
    const fetchDepositData = (): void => {
      combineLatest([
        api.boltzDeposit$(currency),
        api.boltzServiceInfo$(currency),
      ]).subscribe({
        next: (resp) => {
          setDepositData(resp[0]);
          setServiceInfo(resp[1]);
          setFetchingData(false);
        },
        error: (err) => {
          setError(getErrorMsg(err));
          setFetchingData(false);
        },
      });
    };

    fetchDepositData();
    const subscription = refreshSubject.subscribe(() => fetchDepositData());

    return () => subscription.unsubscribe();
  }, [currency, refreshSubject, setError, setFetchingData]);

  useEffect(() => {
    const subscription = getInfo$.subscribe({
      next: (resp) => {
        const currentHeight = Number.parseInt(resp.lnd[currency].blockheight);
        setCurrentBlockHeight(currentHeight);
        if (depositData && currentHeight >= depositData.timeoutBlockHeight) {
          refreshSubject.next();
          setAddressAutoUpdated(true);
        }
      },
      error: (err) => setError(getErrorMsg(err)),
    });

    return () => subscription.unsubscribe();
  }, [getInfo$, currency, refreshSubject, depositData, setError]);

  return (
    <>
      {!!depositData && !!serviceInfo && !!currentBlockHeight && (
        <>
          {addressAutoUpdated && (
            <WarningMessage message="Address updated due to timeout" />
          )}
          {!qrOpen ? (
            <Grid item>
              <Typography variant="body2" align="center">
                Deposit between {satsToCoinsStr(serviceInfo.limits.minimal)} and{" "}
                {satsToCoinsStr(serviceInfo.limits.maximal, currency)} in the
                following address in the next ~
                {getTimeString(
                  getAvgMinutesBetweenBlocks(
                    currentBlockHeight,
                    depositData.timeoutBlockHeight,
                    currency
                  )!
                )}{" "}
                (block height {depositData.timeoutBlockHeight}).
              </Typography>
              <Address
                address={depositData.address}
                openQr={() => setQrOpen(true)}
                readOnly={true}
              />
              <BoltzFeeInfo fees={serviceInfo.fees} currency={currency} />
              <div className={classes.row}>
                <CheckBoltzTransactionStatus
                  currency={currency}
                  id={depositData.id}
                />
              </div>
            </Grid>
          ) : (
            <Grid item>
              <QrCode
                value={depositData.address}
                handleClose={() => setQrOpen(false)}
              />
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default BoltzDeposit;
