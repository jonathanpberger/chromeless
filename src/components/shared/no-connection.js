/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import { withStyles } from '@mui/material/styles';

const styles = (theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    color: theme.palette.text.primary,
  },
  icon: {
    height: 64,
    width: 64,
  },
  tryAgainButton: {
    marginTop: 16,
  },
});

const NoConnection = (props) => {
  const {
    classes,
    onTryAgainButtonClick,
  } = props;

  return (
    <div sx={classes.root}>
      <ErrorIcon sx={classes.icon} color="textPrimary" />
      <br />
      <Typography
        color="inherit"
        variant="h6"
      >
        Failed to Connect to Server
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="subtitle1"
      >
        Please check your Internet connection.
      </Typography>
      <Button
        sx={classes.tryAgainButton}
        color="primary"
        onClick={onTryAgainButtonClick}
      >
        Try Again
      </Button>
    </div>
  );
};

NoConnection.propTypes = {
  classes: PropTypes.object.isRequired,
  onTryAgainButtonClick: PropTypes.func.isRequired,
};

export default withStyles(styles, { name: 'NoConnection' })(NoConnection);
