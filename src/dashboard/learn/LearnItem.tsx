import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";
import YouTube from "react-youtube";

type LearnItemProps = {
  videoId: string;
  title: string;
};

const opts = {
  height: "200",
  width: "350",
};

const useStyles = makeStyles(() => ({
  title: {
    fontSize: "16px",
    color: "#f2f2f2",
  },
}));

const LearnItem: React.FunctionComponent<LearnItemProps> = (props) => {
  const { videoId, title } = props;
  const classes = useStyles();

  return (
    <Grid item>
      <YouTube videoId={videoId} opts={opts} />
      <p className={classes.title}>{title}</p>
    </Grid>
  );
};

export default LearnItem;
