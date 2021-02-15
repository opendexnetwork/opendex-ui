import {
  Grid,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import React, { ReactElement } from "react";
import { openLink } from "../../../common/appUtil";
import { satsToCoinsStr } from "../../../common/currencyUtil";
import { Fees } from "../../../models/BoltzFees";

//styles
import { IconContainer } from "./styles";

type BoltzFeeInfoProps = {
  fees: Fees;
  currency: string;
  amount?: number;
  isReverse?: boolean;
};

const BOLTZ_URL = "https://boltz.exchange";

const BoltzFeeInfo = (props: BoltzFeeInfoProps): ReactElement => {
  const { fees, currency, amount, isReverse } = props;

  const swapFee = amount
    ? `${satsToCoinsStr((amount * fees.percentage) / 100, currency)} (${
        fees.percentage
      }%)`
    : `${fees.percentage}%`;

  return (
    <Grid
      item
      container
      alignItems="center"
      justify="center"
      wrap="nowrap"
      spacing={1}
    >
      <IconContainer item>
        <Tooltip
          title={
            <div>
              <div>You are using Boltz as swap service</div>
              <Link
                component="button"
                color="textPrimary"
                onClick={() => openLink(BOLTZ_URL)}
              >
                {BOLTZ_URL}
              </Link>
            </div>
          }
          interactive
        >
          <InfoIcon fontSize="small" />
        </Tooltip>
      </IconContainer>
      <Grid item>
        <Typography variant="body2" align="center" noWrap>
          Boltz swap fee: <strong>{swapFee}</strong> | Miner fee:{" "}
          <strong>
            {satsToCoinsStr(
              isReverse ? fees.miner.reverse : fees.miner.normal,
              currency
            )}
          </strong>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default BoltzFeeInfo;
