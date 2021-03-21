import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { openDexLogo } from "../../utils/svgIcons";

const useStyles = makeStyles(() => ({
  logoContainer: {
    paddingTop: "30px",
    width: "100%",
  },
  logo: {
    height: "75px",
    width: "100%",
  },
}));

export const OpenDexMainLogo: React.FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.logoContainer}>
      <img src={openDexLogo} alt="OpenDEX" className={classes.logo} />
    </div>
  );
};
