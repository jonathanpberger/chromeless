/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import React from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

import connectComponent from '../../helpers/connect-component';

const styles = (theme) => ({
  root: {
    position: 'relative',
    height: 28,
  },
  top: {
    color: theme.palette.primary.main,
    position: 'absolute',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 2,
  },
  bottom: {
    color: theme.palette.primary.main,
    opacity: 0.2,
    // animationDuration: '550ms',
    position: 'absolute',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 1,
  },
  tooltip: {
    maxWidth: 400,
  },
});

const AppCard = ({
  classes,
  defaultDesc,
  progressDesc,
  progressPercent,
}) => (
  <div sx={classes.root}>
    <Tooltip
      title={progressDesc || defaultDesc}
      aria-label={progressDesc || defaultDesc}
      placement="right"
      classes={{
        tooltip: classes.tooltip,
      }}
    >
      <CircularProgress
        variant="determinate"
        value={progressPercent}
        sx={classes.top}
        size={28}
        thickness={4}
      />
    </Tooltip>
    <CircularProgress
      variant="determinate"
      value={100}
      sx={classes.bottom}
      size={28}
      thickness={4}
    />
  </div>
);

AppCard.defaultProps = {
  progressDesc: null,
  progressPercent: 0,
};

AppCard.propTypes = {
  classes: PropTypes.object.isRequired,
  progressDesc: PropTypes.string,
  progressPercent: PropTypes.number,
  defaultDesc: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  progressPercent: state.general.installationProgress.percent,
  progressDesc: state.general.installationProgress.desc,
});

export default connectComponent(
  AppCard,
  mapStateToProps,
  null,
  styles,
);
