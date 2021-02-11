import { Grid, Typography } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { Observable } from "rxjs";
import { getErrorMsg } from "../../common/errorUtil";
import QrCode from "../../common/QrCode";
import { Info } from "../../models/Info";
import Address from "./Address";

type ConnextDepositProps = {
  currency: string;
  getInfo$: Observable<Info>;
  setError: (value: string) => void;
  setFetchingData: (value: boolean) => void;
};

const ConnextDeposit = (props: ConnextDepositProps): ReactElement => {
  const { currency, getInfo$, setError, setFetchingData } = props;
  const [qrOpen, setQrOpen] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    getInfo$.subscribe({
      next: (resp) => {
        const connextAddress = resp.connext?.address;
        if (connextAddress) {
          setAddress(resp.connext.address);
        } else {
          setError("Cannot find address");
        }
        setFetchingData(false);
      },
      error: (err) => {
        setError(getErrorMsg(err));
        setFetchingData(false);
      },
    });
  }, [getInfo$, setError, setFetchingData]);

  return (
    <>
      {!qrOpen ? (
        <Grid item>
          <Typography variant="body2" align="center">
            Deposit {currency} in the following address from your wallet
          </Typography>
          <Address
            address={address}
            openQr={() => setQrOpen(true)}
            readOnly={true}
          />
        </Grid>
      ) : (
        <Grid item>
          <QrCode value={address} handleClose={() => setQrOpen(false)} />
        </Grid>
      )}
    </>
  );
};

export default ConnextDeposit;
