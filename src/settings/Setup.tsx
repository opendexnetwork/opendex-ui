import {
  createStyles,
  Fade,
  Grid,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  Theme,
  Typography,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import { Subject } from "rxjs";
import { BackupStore, BACKUP_STORE } from "../stores/backupStore";
import BackupDirectory from "./BackupDirectory";
import ChangePassword from "./ChangePassword";
import MnemonicPhrase from "./MnemonicPhrase";

type SetupProps = {
  backupStore?: BackupStore;
};

type SetupStep = {
  label: string;
  component: ReactElement;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: "100%",
      width: "100%",
    },
    stepper: {
      backgroundColor: theme.palette.background.default,
    },
    successIcon: {
      color: theme.palette.success.main,
      fontSize: 72,
      margin: theme.spacing(2),
    },
  })
);

const Setup = inject(BACKUP_STORE)(
  observer(
    (props: SetupProps): ReactElement => {
      const { backupStore } = props;
      const [activeStep, setActiveStep] = React.useState(0);
      const [stepCompletedSubject, setStepCompletedSubject] = useState<
        Subject<boolean> | undefined
      >(undefined);
      const classes = useStyles();

      const createStepCompletedSubject = (): Subject<boolean> => {
        const subject = new Subject<boolean>();
        subject.subscribe(
          (value) =>
            value && setActiveStep((prevActiveStep) => prevActiveStep + 1)
        );
        return subject;
      };

      useEffect(() => {
        setStepCompletedSubject(createStepCompletedSubject());
      }, []);

      useEffect(() => {
        if (!backupStore!.defaultPassword) {
          setActiveStep(backupStore!.mnemonicShown ? 2 : 1);
        }
      }, [backupStore]);

      const steps: SetupStep[] = [
        {
          label: "Set password to unlock opendexd",
          component: (
            <ChangePassword
              isSetup
              passwordUpdatedSubject={stepCompletedSubject}
            />
          ),
        },
        {
          label: "Write down mnemonic phrase",
          component: (
            <MnemonicPhrase onCompleteSubject={stepCompletedSubject!} />
          ),
        },
        {
          label: "Choose backup directory",
          component: (
            <BackupDirectory onCompleteSubject={stepCompletedSubject} />
          ),
        },
      ];

      return (
        <Grid
          item
          container
          justify="space-between"
          alignItems="center"
          direction="column"
          className={classes.wrapper}
        >
          <Grid item container justify="center">
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              className={classes.stepper}
            >
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
          {activeStep < steps.length ? (
            steps[activeStep].component
          ) : (
            <>
              <Fade in={true} timeout={1000}>
                <Grid
                  item
                  container
                  alignItems="center"
                  justify="center"
                  direction="column"
                >
                  <Grid item container justify="center">
                    <CheckCircleIcon className={classes.successIcon} />
                  </Grid>
                  <Grid item container justify="center">
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      align="center"
                    >
                      Setup complete
                    </Typography>
                  </Grid>
                </Grid>
              </Fade>
              <Grid item container />
            </>
          )}
        </Grid>
      );
    }
  )
);

export default Setup;
