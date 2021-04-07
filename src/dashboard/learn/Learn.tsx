import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import LearnItem from "./LearnItem";

const fetchVideos = async () => {
  const response = await fetch(
    "https://youtube.googleapis.com/youtube/v3/search?channelId=UCemVkpcBJvbzciHp_5Ly4dw&key=AIzaSyAitbrvF7nJkOlarAMAcco7zwgN-msm0Nc&part=snippet,id&order=date&maxResults=6"
  );
  if (response.status === 200) {
    const responseJSON = await response.json();
    return responseJSON;
  }
};

const useStyles = makeStyles(() => ({
  heading: {
    fontSize: "30px",
    color: "#f2f2f2",
  },
}));

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
  };
}

interface Videos {
  videoId: string;
  title: string;
}

const Learn: React.FunctionComponent = () => {
  const classes = useStyles();
  const [videos, setVideos] = useState<Videos[]>([]);
  const [error, setError] = useState("");

  const handleFetchVideos = async () => {
    try {
      const response = await fetchVideos();
      response.items.forEach((video: Video) => {
        setVideos((prevState) => {
          return [
            ...prevState,
            { videoId: video.id.videoId, title: video.snippet.title },
          ];
        });
      });
    } catch (e) {
      setError("Unable to fetch videos.");
    }
  };

  useEffect(() => {
    handleFetchVideos();
  }, []);

  return (
    <div>
      <h1 className={classes.heading}>Learn</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <Grid container spacing={2}>
          {videos.map((video) => {
            return <LearnItem {...video} key={video.videoId} />;
          })}
        </Grid>
      )}
    </div>
  );
};

export default Learn;
