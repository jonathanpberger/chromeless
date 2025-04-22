/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

import connectComponent from '../../helpers/connect-component';

const styles = (theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    position: 'relative',
  },
  subtitle1: {
    // https://stackoverflow.com/questions/19347988/make-empty-div-of-one-line-height
    // ensure height when text is empty
    height: '1.75rem',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 4,
    color: theme.palette.grey[500],
    padding: theme.spacing(1),
  },
});

const EnhancedDialogTitle = ({
  children,
  classes,
  disableTypography,
  onClose,
}) => (
  <DialogTitle sx={classes.root}>
    {disableTypography ? children : (
      <Typography variant="subtitle1" sx={classes.subtitle1}>{children}</Typography>
    )}
    {onClose ? (
      <IconButton
        size="small"
        aria-label="Close"
        sx={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    ) : null}
  </DialogTitle>
);

EnhancedDialogTitle.defaultProps = {
  children: null,
  disableTypography: false,
};

EnhancedDialogTitle.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  disableTypography: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default connectComponent(
  EnhancedDialogTitle,
  null,
  null,
  styles,
);