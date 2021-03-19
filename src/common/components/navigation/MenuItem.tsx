import { ListItemIcon, Tooltip, makeStyles, Theme } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React, { ComponentClass, ElementType, ReactElement } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { Path } from "../../../router/Path";

export type MenuItemProps = {
  path: Path;
  text: string;
  component:
    | ComponentClass<any>
    | (() => ReactElement)
    | React.ReactElement<any>;
  icon: ElementType;
  isFallback?: boolean;
  isDisabled?: boolean;
  tooltipTextRows?: string[];
  isBeforeSelected?: boolean;
  isAfterSelected?: boolean;
  selected?: boolean;
  selectedIndex?: number;
};

const getListItemColor = (theme: Theme, props: MenuItemProps) => {
  if (props.isDisabled) {
    return theme.palette.text.disabled;
  } else if (props.selected) {
    return "#d7d9e2";
  } else {
    return "#9a9ca4";
  }
};

const getListItemBorderRadius = (props: MenuItemProps) => {
  if (props.isBeforeSelected && props.selectedIndex !== -1) {
    return "25px 0px 25px 25px";
  } else if (props.isAfterSelected && props.selectedIndex !== -1) {
    return "25px 25px 0px 25px";
  } else {
    return "25px 0px 0px 25px";
  }
};

const getListItemBoxShadow = (props: MenuItemProps) => {
  if (props.isBeforeSelected && props.selectedIndex !== -1) {
    return "30px 0px 0px #0c0c0c";
  } else if (props.isAfterSelected && props.selectedIndex !== -1) {
    return "25px 0px 0px #0c0c0c";
  } else {
    return "";
  }
};

const getMuiListItemHoverFocusProperties = (props: MenuItemProps) => ({
  color: !props.isDisabled ? "#d7d9e2" : "",
  backgroundColor: !props.selected ? "transparent" : "#0c0c0c",
});

const useStyles = makeStyles((theme) => ({
  listItem: (props: MenuItemProps) => ({
    height: "50px",
    color: getListItemColor(theme, props),
    borderRadius: getListItemBorderRadius(props),
    boxShadow: getListItemBoxShadow(props),
    backgroundColor: props.selected ? "#0c0c0c" : "transparent",
    "&.MuiListItem-root:hover": getMuiListItemHoverFocusProperties(props),
    "&.Mui-focusVisible": getMuiListItemHoverFocusProperties(props),
  }),
  listIcon: {
    color: "inherit",
  },
}));

function MenuItem(props: MenuItemProps): ReactElement {
  const { url } = useRouteMatch();
  const classes = useStyles(props);
  const navigateTo = `${url}${props.path}`;
  const buttonProps = props.isDisabled ? {} : { disableRipple: true };

  return (
    <Tooltip
      placement="bottom-end"
      title={
        props.isDisabled
          ? props.tooltipTextRows!.map((row) => <div key={row}>{row}</div>)
          : ""
      }
    >
      <ListItem
        className={classes.listItem}
        button={!props.isDisabled as any}
        component={props.isDisabled ? "div" : NavLink}
        to={navigateTo}
        {...buttonProps}
      >
        <ListItemIcon className={classes.listIcon}>
          <props.icon />
        </ListItemIcon>
        <ListItemText primary={props.text} />
      </ListItem>
    </Tooltip>
  );
}

export default MenuItem;
