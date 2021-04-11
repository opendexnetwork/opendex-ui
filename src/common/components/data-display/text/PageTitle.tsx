import React, { ReactElement } from "react";
import { Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { notificationIcon } from "../../../utils/svgIcons";

type PageTitleProps = {
  title: string;
};

const useStyles = makeStyles(() => ({
  headingContainer: {
    display: "flex",
    alignItems: "center",
  },
  heading: {
    fontSize: "30px",
    fontWeight: 500,
  },
  notificationIconContainer: {
    marginLeft: "auto",
  },
  notificationIcon: {
    cursor: "pointer",
  },
}));

const PageTitle = (props: PageTitleProps): ReactElement => {
  const { title } = props;
  const classes = useStyles();

  return (
    <div className={classes.headingContainer}>
      <h1 className={classes.heading}>{title}</h1>
      {false && (
        <Icon className={classes.notificationIconContainer}>
          <img
            src={notificationIcon}
            alt="notifications"
            className={classes.notificationIcon}
          />
        </Icon>
      )}
    </div>
  );
};

export default PageTitle;
