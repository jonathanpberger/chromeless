/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState, useRef } from 'react';

import PropTypes from 'prop-types';

import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';

import { FixedSizeGrid } from 'react-window';

import connectComponent from '../../../helpers/connect-component';

import AppCard from '../../shared/app-card';
import EmptyState from '../../shared/empty-state';

import DefinedAppBar from './defined-app-bar';
import Toolbar from './toolbar';

import { updateScrollOffset } from '../../../state/installed/actions';

const styles = (theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
  },
  statusText: {
    marginRight: theme.spacing(1),
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeringCircularProgress: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedSizeGrid: {
    overflowX: 'hidden !important',
  },
});

const Installed = ({
  activeQuery,
  appIds,
  classes,
  isSearching,
  onUpdateScrollOffset,
  scanning,
  scrollOffset,
}) => {
  const [innerHeight, updateInnerHeight] = useState(window.innerHeight);
  const [innerWidth, updateInnerWidth] = useState(window.innerWidth);
  const gridRef = useRef(null);

  useEffect(() => {
    const updateWindowSize = () => {
      updateInnerHeight(window.innerHeight);
      updateInnerWidth(window.innerWidth);
    };
    window.addEventListener('resize', updateWindowSize);
    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  useEffect(() => () => {
    if (gridRef.current) {
      onUpdateScrollOffset(gridRef.current.scrollTop);
    }
  }, [gridRef, onUpdateScrollOffset]);

  const renderContent = () => {
    if (scanning || isSearching) {
      return (
        <div sx={classes.centeringCircularProgress}>
          <CircularProgress size={28} />
        </div>
      );
    }

    if (appIds.length > 0) {
      const rowHeight = 158 + 16;
      const innerWidthMinurScrollbar = window.process.platform === 'darwin' ? innerWidth - 10 : innerWidth - 20;
      const columnCount = Math.floor(innerWidthMinurScrollbar / 184);
      const rowCount = Math.ceil(appIds.length / columnCount);
      const columnWidth = Math.floor(innerWidthMinurScrollbar / columnCount);
      // total window height - (searchbox: 40, toolbar: 36, bottom nav: 40)
      const scrollHeight = innerHeight - 116;
      const Cell = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex;

        if (index >= appIds.length) return <div style={style} />;

        const appId = appIds[index];
        return (
          <div sx={classes.cardContainer} style={style}>
            <AppCard
              key={appId}
              id={appId}
            />
          </div>
        );
      };
      Cell.propTypes = {
        columnIndex: PropTypes.number.isRequired,
        rowIndex: PropTypes.number.isRequired,
        style: PropTypes.object.isRequired,
      };

      return (
        <FixedSizeGrid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={scrollHeight}
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={innerWidth}
          initialScrollTop={scrollOffset}
          outerRef={gridRef}
          sx={classes.fixedSizeGrid}
        >
          {Cell}
        </FixedSizeGrid>
      );
    }

    if (activeQuery) {
      return (
        <EmptyState
          icon={SearchIcon}
          title="No Matching Results"
        >
          <Typography
            variant="subtitle1"
            align="center"
          >
            Your search -&nbsp;
            <b>{activeQuery}</b>
            &nbsp;- did not match any installed apps or browser instances.
          </Typography>
        </EmptyState>
      );
    }

    return (
      <EmptyState
        icon={GetAppIcon}
        title="No Installed Apps or Browser Instances"
      >
        Your installed apps and browser instances on this machine will show up here.
      </EmptyState>
    );
  };

  return (
    <div sx={classes.root}>
      <DefinedAppBar />
      <div sx={classes.scrollContainer}>
        <Toolbar />
        <Divider />
        {renderContent()}
      </div>
    </div>
  );
};

Installed.defaultProps = {
  activeQuery: '',
  isSearching: false,
};

Installed.propTypes = {
  activeQuery: PropTypes.string,
  appIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  classes: PropTypes.object.isRequired,
  isSearching: PropTypes.bool,
  onUpdateScrollOffset: PropTypes.func.isRequired,
  scanning: PropTypes.bool.isRequired,
  scrollOffset: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  activeQuery: state.installed.activeQuery,
  appIds: state.installed.filteredSortedAppIds || state.appManagement.sortedAppIds,
  isSearching: state.installed.isSearching,
  scanning: state.appManagement.scanning,
  scrollOffset: state.installed.scrollOffset,
});

const actionCreators = {
  updateScrollOffset,
};

export default connectComponent(
  Installed,
  mapStateToProps,
  actionCreators,
  styles,
);
