import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import React, { ReactElement } from "react";
import { openLink } from "../../common/appUtil";
import { satsToCoinsStr } from "../../common/currencyUtil";
import { Fees } from "../../models/BoltzFees";

type BoltzFeeInfoProps = {
  fees: Fees;
  currency: string;
  amount?: number;
  isReverse?: boolean;
};

const BOLTZ_URL = "https://boltz.exchange";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      display: "flex",
      alignItems: "center",
    },
    link: {
      color: theme.palette.text.primary,
      "a:hover": {
        color: theme.palette.text.primary,
      },
    },
  })
);

const BoltzFeeInfo = (props: BoltzFeeInfoProps): ReactElement => {
  const { fees, currency, amount, isReverse } = props;
  const classes = useStyles();

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
      <Grid item className={classes.iconContainer}>
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
      </Grid>
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
