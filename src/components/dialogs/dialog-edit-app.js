/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import connectComponent from '../../helpers/connect-component';
import isUrl from '../../helpers/is-url';

import {
  close,
  save,
  getIconFromInternet,
  getIconFromAppSearch,
  updateForm,
  updateFormOpts,
} from '../../state/dialog-edit-app/actions';
import { open as openDialogCreateCustomApp } from '../../state/dialog-create-custom-app/actions';

import defaultIcon from '../../assets/default-icon.png';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = (theme) => ({
  grid: {
    marginTop: theme.spacing(1),
  },
  iconContainer: {
    height: 96,
    width: 96,
    backgroundColor: theme.palette.common.minBlack,
  },
  icon: {
    height: 96,
    width: 96,
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
    display: 'flex',
  },
  dialogActionsLeft: {
    flex: 1,
  },
  buttonBot: {
    marginTop: theme.spacing(1),
  },
  caption: {
    display: 'block',
  },
  captionDisabled: {
    color: theme.palette.text.disabled,
  },
  link: {
    cursor: 'pointer',
  },
});

const DialogEditApp = (props) => {
  const {
    classes,
    downloadingIcon,
    icon,
    id,
    internetIcon,
    name,
    onClose,
    onGetIconFromInternet,
    onGetIconFromAppSearch,
    onSave,
    onUpdateForm,
    open,
    savable,
    url,
    urlDisabled,
    urlError,
    onOpenDialogCreateCustomApp,
  } = props;

  let iconPath = defaultIcon;
  if (icon) {
    if (isUrl(icon)) iconPath = icon;
    else iconPath = `file://${icon}`;
  } else if (internetIcon) {
    iconPath = internetIcon;
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose}>
        {`Edit "${name}"`}
      </EnhancedDialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          id="name"
          label="Name"
          helperText={`This cannot be changed. To customize the name, clone "${name}".`}
          margin="normal"
          onChange={(e) => onUpdateForm({ name: e.target.value })}
          value={name}
          disabled
        />
        {!urlDisabled && (
          <TextField
            fullWidth
            id="url"
            label="URL"
            helperText={urlError}
            margin="normal"
            onChange={(e) => onUpdateForm({ url: e.target.value })}
            value={url}
            error={Boolean(urlError)}
          />
        )}
        <Grid container spacing={1} sx={classes.grid} wrap="nowrap">
          <Grid item xs={12} sm="auto">
            <div sx={classes.iconContainer}>
              <img src={iconPath} alt={name} sx={classes.icon} />
            </div>
          </Grid>
          {!id.startsWith('custom-') ? (
            <Grid item xs={12} sm="auto">
              <Typography
                variant="body2"
                className={classnames(classes.caption, classes.captionDisabled)}
              >
                This app icon is managed by WebCatalog and is not editable. To customize the icon,
                {` clone "${name}".`}
              </Typography>
            </Grid>
          ) : (
            <Grid item xs={12} sm="auto">
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  window.remote.dialog.showOpenDialog({
                    filters: [
                      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'tif', 'bmp', 'dib'] },
                    ],
                    properties: ['openFile'],
                  })
                    .then(({ canceled, filePaths }) => {
                      if (!canceled && filePaths && filePaths.length > 0) {
                        onUpdateForm({ icon: filePaths[0] });
                      }
                    })
                    .catch(console.log); // eslint-disable-line
                }}
              >
                Select Local Image...
              </Button>
              <Typography
                variant="caption"
                sx={classes.caption}
              >
                PNG, JPEG, GIF, TIFF or BMP.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={classes.buttonBot}
                disabled={Boolean(!url || urlError || downloadingIcon)}
                onClick={() => onGetIconFromInternet()}
              >
                {downloadingIcon ? 'Downloading...' : 'Download Icon from URL'}
              </Button>
              <br />
              <Button
                variant="outlined"
                size="small"
                sx={classes.buttonBot}
                disabled={Boolean(!url || urlError || urlDisabled || downloadingIcon)}
                onClick={() => onGetIconFromAppSearch()}
              >
                {downloadingIcon ? 'Downloading...' : 'Download Icon from WebCatalog'}
              </Button>
              <br />
              <Button
                variant="outlined"
                size="small"
                sx={classes.buttonBot}
                disabled={!(icon || internetIcon) || downloadingIcon}
                onClick={() => onUpdateForm({ icon: null, internetIcon: null })}
              >
                Reset to Default
              </Button>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={classes.dialogActions}>
        <div sx={classes.dialogActionsLeft}>
          <Button
            onClick={() => {
              onClose();
              onOpenDialogCreateCustomApp({
                name: `${name} 2`,
                url,
                urlDisabled: Boolean(!url),
                icon,
              });
            }}
          >
            Clone
          </Button>
        </div>
        <div>
          <Button
            onClick={onClose}
          >
            Cancel
          </Button>
          <Tooltip title="This action'll also update this app to the latest version">
            <Button
              color="primary"
              onClick={onSave}
              disabled={!savable}
            >
              Save
            </Button>
          </Tooltip>
        </div>
      </DialogActions>
    </Dialog>
  );
};

DialogEditApp.defaultProps = {
  icon: null,
  id: '',
  internetIcon: null,
  name: '',
  savable: false,
  url: '',
  urlDisabled: false,
  urlError: null,
};

DialogEditApp.propTypes = {
  classes: PropTypes.object.isRequired,
  downloadingIcon: PropTypes.bool.isRequired,
  icon: PropTypes.string,
  id: PropTypes.string,
  internetIcon: PropTypes.string,
  name: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onGetIconFromInternet: PropTypes.func.isRequired,
  onGetIconFromAppSearch: PropTypes.func.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  savable: PropTypes.bool,
  url: PropTypes.string,
  urlDisabled: PropTypes.bool,
  urlError: PropTypes.string,
};

const mapStateToProps = (state) => {
  const {
    downloadingIcon,
    open,
    savable,
    form: {
      icon,
      id,
      internetIcon,
      name,
      nameError,
      url,
      urlDisabled,
      urlError,
    },
  } = state.dialogEditApp;

  return {
    downloadingIcon,
    icon,
    id,
    internetIcon,
    name,
    nameError,
    open,
    savable,
    url,
    urlDisabled,
    urlError,
  };
};

const actionCreators = {
  close,
  save,
  getIconFromInternet,
  getIconFromAppSearch,
  updateForm,
  updateFormOpts,
  openDialogCreateCustomApp,
};

export default connectComponent(
  DialogEditApp,
  mapStateToProps,
  actionCreators,
  styles,
);
