import {
  Icon,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@material-ui/core";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import React, { ReactElement } from "react";
import { copyToClipboard } from "../../../common/appUtil";

//styles
import {
  AddressContainer,
  AddressField
} from "./styles";

type AddressProps = {
  address: string;
  setAddress?: (address: string) => void;
  showQr?: boolean;
  openQr?: () => void;
  readOnly: boolean;
};

const Address = (props: AddressProps): ReactElement => {
  const { address, setAddress, showQr, openQr, readOnly } = props;

  return (
    <AddressContainer
      item
      container
      direction="column"
    >
      <AddressField
        fullWidth
        color="primary"
        readOnly={readOnly}
        value={address}
        onChange={(event: any) =>
          setAddress ? setAddress(event.target.value) : void 0
        }
        endAdornment={
          <InputAdornment position="end">
            <div>
              <Tooltip title="Copy Address">
                <IconButton onClick={() => copyToClipboard(address)}>
                  {<FileCopyOutlinedIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              {showQr !== false && (
                <Tooltip title="Show QR">
                  <IconButton onClick={openQr}>
                    {<Icon fontSize="small">qr_code</Icon>}
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </InputAdornment>
        }
      />
    </AddressContainer>
  );
};

export default Address;
