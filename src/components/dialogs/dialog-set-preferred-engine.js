/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';

import HelpIcon from '@mui/icons-material/Help';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  save,
  updateForm,
} from '../../state/dialog-set-preferred-engine/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';
import EngineList from '../shared/engine-list';
import HelpTooltip from '../shared/help-tooltip';

const styles = (theme) => ({
  grid: {
    marginTop: theme.spacing(1),
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
  inline: {
    display: 'inline',
  },
  content: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

const DialogSetPreferredEngine = (props) => {
  const {
    classes,
    engine,
    onClose,
    onSave,
    onUpdateForm,
    open,
  } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose} disableTypography>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <Grid item>
            <Typography variant="subtitle1">
              Choose Preferred Browser Engine
            </Typography>
          </Grid>
          <Grid item>
            <HelpTooltip
              title={(
                <Typography variant="body2" color="textPrimary">
                  Chromeless lets you pick your preferrred browser engine to power your apps.
                  After you install an app,
                  you will have to uninstall and then reinstall the app to change its engine.
                </Typography>
              )}
            >
              <HelpIcon color="disabled" />
            </HelpTooltip>
          </Grid>
        </Grid>
      </EnhancedDialogTitle>
      <DialogContent sx={classes.content}>
        <EngineList
          onEngineSelected={(selectedEngine) => onUpdateForm({ engine: selectedEngine })}
          engine={engine}
        />
      </DialogContent>
      <DialogActions sx={classes.dialogActions}>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogSetPreferredEngine.propTypes = {
  classes: PropTypes.object.isRequired,
  engine: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
    form: {
      engine,
    },
  } = state.dialogSetPreferredEngine;

  return {
    engine,
    open,
  };
};

const actionCreators = {
  close,
  save,
  updateForm,
};

export default connectComponent(
  DialogSetPreferredEngine,
  mapStateToProps,
  actionCreators,
  styles,
);
