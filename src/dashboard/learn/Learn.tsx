import { makeStyles } from "@material-ui/core";
import React from "react";
import Grid from "@material-ui/core/Grid";
import LearnItem from "./LearnItem";

const videos = [
  {
    videoId: "EGmR676jMt8",
    title: "Community Call #19 (2021-03-24)",
  },
  {
    videoId: "oB3BeDNtN7g",
    title: "Community Call #18 (2021-03-17)",
  },
  {
    videoId: "zpwiZlbRRbs",
    title: "Community Call #16 (2021-02-24)",
  },
  {
    videoId: "A9bQPYvWb1o",
    title: "Community Call #14 (2021-02-10)",
  },
  {
    videoId: "Xha5l6t19Nk",
    title: "Community Call #13 (2021-02-03)",
  },
  {
    videoId: "tL5FRf-QvH8",
    title: "Community Call #12 (2021-01-27)",
  },
  {
    videoId: "CpeFQqFKksg",
    title: "Community Call #11 (2021-01-13)",
  },
  {
    videoId: "CFwnbgoMMBM",
    title: "Community Call #10 (2020-12-23)",
  },
  {
    videoId: "QTx7U6fPe_k",
    title: "Community Call #9 (2020-12-16)",
  },
  {
    videoId: "oBoDNGI8f3w",
    title: "Community Call #8 (2020-12-09)",
  },
  {
    videoId: "_KbbTmMA8WM",
    title: "Community Call #7 (2020-12-02)",
  },
  {
    videoId: "xi0sXZgG9NE",
    title: "Community Call #6 (2020-11-25)",
  },
  {
    videoId: "tt_TYVft4dQ",
    title: "Community Call #5 (2020-11-18)",
  },
  {
    videoId: "iNw5d1rZUqY",
    title: "Community Call #4 (2020-11-11)",
  },
  {
    videoId: "IBrVkzyCwb4",
    title: "Community Call #3 (2020-11-04)",
  },
  {
    videoId: "rC7zlCSuVEc",
    title: "Community Call #2 (2020-10-28)",
  },
  {
    videoId: "mGumdYAjDkY",
    title: "Community Call #1 (2020-10-21)",
  },
];

const useStyles = makeStyles(() => ({
  heading: {
    fontSize: "30px",
    color: "#f2f2f2",
  },
}));

const Learn: React.FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div>
      <h1 className={classes.heading}>Learn</h1>
      <Grid container spacing={2}>
        {videos.map((video) => {
          return <LearnItem {...video} key={video.videoId} />;
        })}
      </Grid>
    </div>
  );
};

export default Learn;
