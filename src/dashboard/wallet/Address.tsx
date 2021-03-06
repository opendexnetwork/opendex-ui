import {
  createStyles,
  Grid,
  Icon,
  InputAdornment,
  makeStyles,
  Theme,
} from "@material-ui/core";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import React, { ReactElement } from "react";
import IconButton from "../../common/components/input/buttons/IconButton";
import TextField from "../../common/components/input/text/TextField";
import { copyToClipboard } from "../../common/utils/appUtil";

type AddressProps = {
  address: string;
  setAddress?: (address: string) => void;
  showQr?: boolean;
  openQr?: () => void;
  readOnly: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addressContainer: {
      margin: `${theme.spacing(2)}px 0px`,
    },
    addressField: {
      marginBottom: theme.spacing(2),
    },
    addressFieldReadOnly: {
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(2),
      "&.MuiOutlinedInput-root.Mui-focused fieldset": {
        borderColor: theme.palette.common.white,
        borderWidth: 1,
      },
    },
    qrButton: {
      textTransform: "none",
    },
  })
);

const Address = (props: AddressProps): ReactElement => {
  const { address, setAddress, showQr, openQr, readOnly } = props;
  const classes = useStyles();

  const addressFieldClass = readOnly
    ? `${classes.addressField} ${classes.addressFieldReadOnly}`
    : classes.addressField;

  return (
    <Grid
      item
      container
      direction="column"
      className={classes.addressContainer}
    >
      <TextField
        fullWidth
        className={addressFieldClass}
        disabled={readOnly}
        value={address}
        onChange={(event) =>
          setAddress ? setAddress(event.target.value) : void 0
        }
        endAdornment={
          <InputAdornment position="end">
            <div>
              <IconButton
                icon={<FileCopyOutlinedIcon fontSize="small" />}
                tooltipTitle="Copy Addres"
                onClick={() => copyToClipboard(address)}
              />
              {showQr !== false && (
                <IconButton
                  icon={<Icon fontSize="small">qr_code</Icon>}
                  tooltipTitle="Show QR"
                  onClick={openQr}
                />
              )}
            </div>
          </InputAdornment>
        }
      />
    </Grid>
  );
};

export default Address;
