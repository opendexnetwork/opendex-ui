import {
  Button,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import RefreshIcon from "@material-ui/icons/Refresh";
import React, { ReactElement } from "react";
import { Subject } from "rxjs";
import { isLnd } from "../../common/utils/currencyUtil";
import { WalletItemViewType } from "./WalletItem";

type WalletItemHeaderProps = {
  currency: string;
  refreshSubject: Subject<void>;
  isActive: (...type: WalletItemViewType[]) => boolean;
  setActiveViewType: (type: WalletItemViewType) => void;
};

const useStyles = makeStyles(() =>
  createStyles({
    header: {
      minHeight: 48,
    },
    headerButton: {
      textTransform: "none",
      marginRight: -5,
    },
  })
);

const WalletItemHeader = (props: WalletItemHeaderProps): ReactElement => {
  const { currency, refreshSubject, isActive, setActiveViewType } = props;
  const classes = useStyles();

  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      wrap="nowrap"
      className={classes.header}
    >
      <Grid item xs={4}>
        {!isActive(WalletItemViewType.BALANCE) && (
          <Tooltip title="Show Balance">
            <IconButton
              edge="start"
              onClick={() => setActiveViewType(WalletItemViewType.BALANCE)}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        )}
      </Grid>
      <Grid item xs={4}>
        <Typography
          component="h2"
          variant="h6"
          color="textSecondary"
          align="center"
        >
          {currency}
        </Typography>
      </Grid>
      <Grid item container xs={4} justify="flex-end">
        {isActive(WalletItemViewType.BALANCE) && (
          <Button
            className={classes.headerButton}
            onClick={() => setActiveViewType(WalletItemViewType.LIMITS)}
            size="small"
            endIcon={<ArrowForwardIcon />}
          >
            Trading Limits
          </Button>
        )}
        {isActive(WalletItemViewType.DEPOSIT) && isLnd(currency) && (
          <Tooltip title="Request new address">
            <IconButton edge="end" onClick={() => refreshSubject!.next()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Grid>
    </Grid>
  );
};

export default WalletItemHeader;
