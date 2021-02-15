import {
  ClickAwayListener,
  Fade,
  Grid,
  IconButton,
  Popper,
  Tooltip,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SortIcon from "@material-ui/icons/Sort";
import React, { ReactElement, useState } from "react";
import { SortingOrder } from "../SortingUtil";

//styles
import {
  SortIconContainer,
  SortOptionsMenu,
  SortOptionButton,
  SortOptionActiveGrid,
  SortDirIconContainer,
  StyledArrowDownwardIcon,
  StyledArrowUpwardIcon
} from "./styles";

export type SortingOptionsProps<T> = {
  sortOpts: SortOption<T>[];
  orderBy: SortOption<T>;
  sortingOrder: SortingOrder;
  onOptionSelected: (opt: SortOption<T>) => void;
};

export type SortOption<T> = {
  label: string;
  prop: keyof T;
  groupBy?: keyof T;
  sortingOrder?: SortingOrder;
};

function SortingOptions<T>(props: SortingOptionsProps<T>): ReactElement {
  const { sortOpts, orderBy, sortingOrder, onOptionSelected } = props;
  const [sortOptsOpen, setSortOptsOpen] = useState(false);
  const [sortOptsAnchorEl, setSortOptsAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const handleSortIconClick = (event: React.MouseEvent<HTMLElement>): void => {
    if (sortOptsOpen) {
      closeSortOptions();
      return;
    }
    setSortOptsOpen(true);
    setSortOptsAnchorEl(event.currentTarget as HTMLElement);
  };

  const closeSortOptions = (): void => {
    setSortOptsOpen(false);
    setSortOptsAnchorEl(null);
  };

  const getSortingDirIcon = (opt: SortOption<T>): ReactElement | null => {
    if (opt.sortingOrder || opt !== orderBy) {
      return null;
    }
    return sortingOrder === "desc" ? (
      <StyledArrowDownwardIcon />
    ) : (
      <StyledArrowUpwardIcon />
    );
  };

  return (
    <SortIconContainer
      item
      container
      justify="flex-end"
    >
      <ClickAwayListener onClickAway={closeSortOptions}>
        <div>
          <Tooltip title="Sort" placement="left">
            <IconButton onClick={handleSortIconClick}>
              {!sortOptsOpen ? <SortIcon /> : <CloseIcon />}
            </IconButton>
          </Tooltip>
          <Popper
            open={sortOptsOpen}
            anchorEl={sortOptsAnchorEl}
            placement="bottom-end"
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <SortOptionsMenu>
                  <Grid container direction="column">
                    {sortOpts.map((opt) => (
                      <SortOptionButton
                        fullWidth
                        disableRipple
                        size="small"
                        onClick={() => {
                          onOptionSelected(opt);
                          closeSortOptions();
                        }}
                        key={opt.label as string}
                      >
                        <SortOptionActiveGrid
                          item
                          container
                          alignItems="center"
                          spacing={1}
                          wrap="nowrap"
                          sortOptionActive={orderBy.label === opt.label}
                        >
                          <Grid item>
                            <SortDirIconContainer
                              component="div"
                            >
                              {getSortingDirIcon(opt)}
                            </SortDirIconContainer>
                          </Grid>
                          <Grid item>
                            <Typography component="div" variant="caption">
                              {opt.label}
                            </Typography>
                          </Grid>
                        </SortOptionActiveGrid>
                      </SortOptionButton>
                    ))}
                  </Grid>
                </SortOptionsMenu>
              </Fade>
            )}
          </Popper>
        </div>
      </ClickAwayListener>
    </SortIconContainer>
  );
}

export default SortingOptions;
