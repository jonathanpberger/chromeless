/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PowerIcon from '@mui/icons-material/Power';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import WidgetsIcon from '@mui/icons-material/Widgets';

import connectComponent from '../../../helpers/connect-component';
import getEngineName from '../../../helpers/get-engine-name';

import { getInstallingAppsAsList } from '../../../state/app-management/utils';

import { open as openDialogAbout } from '../../../state/dialog-about/slice';
import { open as openDialogOpenSourceNotices } from '../../../state/dialog-open-source-notices/actions';
import { open as openDialogSetInstallationPath } from '../../../state/dialog-set-installation-path/actions';
import { open as openDialogSetPreferredEngine } from '../../../state/dialog-set-preferred-engine/actions';

import {
  requestCheckForUpdates,
  requestOpenInBrowser,
  requestOpenInstallLocation,
  requestQuit,
  requestResetPreferences,
  requestSetPreference,
  requestSetSystemPreference,
  enqueueRequestRestartSnackbar,
} from '../../../senders';

import DefinedAppBar from './defined-app-bar';

import webcatalogIconPng from '../../../assets/products/webcatalog-mac-icon-128@2x.png';
import translatiumIconPng from '../../../assets/products/translatium-mac-icon-128@2x.png';
import singleboxIconPng from '../../../assets/products/singlebox-mac-icon-128@2x.png';
import cloveryIconPng from '../../../assets/products/clovery-mac-icon-128@2x.png';
import switchbarIconPng from '../../../assets/products/switchbar-mac-icon-128@2x.png';

const styles = (theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
    padding: theme.spacing(2),
    overflow: 'auto',
    boxSizing: 'border-box',
  },
  sectionTitle: {
    paddingLeft: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    width: '100%',
    WebkitAppRegion: 'none',
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  inner: {
    width: '100%',
    maxWidth: 500,
    margin: '0 auto',
    [theme.breakpoints.between(800, 928)]: {
      margin: 0,
      float: 'right',
      maxWidth: 'calc(100% - 224px)',
    },
  },
  sidebar: {
    position: 'fixed',
    width: 204,
    color: theme.palette.text.primary,
    [theme.breakpoints.down(800)]: {
      display: 'none',
    },
  },
  listItemPromotion: {
    paddingLeft: theme.spacing(1),
  },
  promotionBlock: {
    display: 'flex',
    flex: 1,
  },
  promotionLeft: {
    height: 64,
    width: 64,
  },
  promotionRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1.5),
  },
  appTitle: {},
  appIcon: {
    height: 64,
  },
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  selectRootExtraMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
});

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
};

const getUpdaterDesc = (status, info) => {
  if (status === 'download-progress') {
    if (info != null) {
      const { transferred, total, bytesPerSecond } = info;
      return `Downloading updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
    }
    return 'Downloading updates...';
  }
  if (status === 'checking-for-update') {
    return 'Checking for updates...';
  }
  if (status === 'update-available') {
    return 'Downloading updates...';
  }
  if (status === 'update-downloaded') {
    if (info && info.version) return `A new version (${info.version}) has been downloaded.`;
    return 'A new version has been downloaded.';
  }
  return null;
};

const Preferences = ({
  allowPrerelease,
  alwaysOnTop,
  appCount,
  attachToMenubar,
  classes,
  defaultHome,
  installationPath,
  installingAppCount,
  onOpenDialogAbout,
  onOpenDialogOpenSourceNotices,
  onOpenDialogSetInstallationPath,
  onOpenDialogSetPreferredEngine,
  openAtLogin,
  preferredEngine,
  requireAdmin,
  themeSource,
  updaterInfo,
  updaterStatus,
  useHardwareAcceleration,
}) => {
  const utmSource = 'chromeless_app';
  const sections = {
    general: {
      text: 'General',
      Icon: WidgetsIcon,
      ref: useRef(),
    },
    advanced: {
      text: 'Advanced',
      Icon: PowerIcon,
      ref: useRef(),
    },
    updates: {
      text: 'Updates',
      Icon: SystemUpdateAltIcon,
      ref: useRef(),
    },
    reset: {
      text: 'Reset',
      Icon: RotateLeftIcon,
      ref: useRef(),
    },
    moreApps: {
      text: 'More Apps',
      Icon: StorefrontIcon,
      ref: useRef(),
    },
    miscs: {
      text: 'Miscellaneous',
      Icon: MoreHorizIcon,
      ref: useRef(),
    },
  };

  return (
    <div sx={classes.root}>
      <DefinedAppBar />
      <div sx={classes.scrollContainer}>
        <div sx={classes.sidebar}>
          <List dense>
            {Object.keys(sections).map((sectionKey, i) => {
              const {
                Icon, text, ref, hidden,
              } = sections[sectionKey];
              if (hidden) return null;
              return (
                <React.Fragment key={sectionKey}>
                  {i > 0 && <Divider />}
                  <ListItem button onClick={() => ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                    />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </div>
        <div sx={classes.inner}>
          <Typography variant="subtitle2" color="textPrimary" sx={classes.sectionTitle} ref={sections.general.ref}>
            General
          </Typography>
          <Paper elevation={0} sx={classes.paper}>
            <List disablePadding dense>
              <ListItem>
                <ListItemText primary="Theme" />
                <Select
                  value={themeSource}
                  onChange={(e) => requestSetPreference('themeSource', e.target.value)}
                  variant="filled"
                  disableUnderline
                  margin="dense"
                  classes={{
                    root: classes.select,
                  }}
                  className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
                >
                  <MenuItem dense value="system">System default</MenuItem>
                  <MenuItem dense value="light">Light</MenuItem>
                  <MenuItem dense value="dark">Dark</MenuItem>
                </Select>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={window.process.platform === 'darwin' ? 'Attach to menu bar' : 'Pin to system tray (notification area)'}
                  secondary="Tip: Right-click on app icon to access context menu."
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={attachToMenubar}
                    onChange={(e) => {
                      requestSetPreference('attachToMenubar', e.target.checked);
                      enqueueRequestRestartSnackbar();
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Keep window always on top"
                  secondary="The window won't be hidden even when you click outside."
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={alwaysOnTop}
                    onChange={(e) => {
                      requestSetPreference('alwaysOnTop', e.target.checked);
                      enqueueRequestRestartSnackbar();
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Startup page"
                  secondary="Startup page is the one that shows when you launch the app."
                />
                <Select
                  value={defaultHome}
                  onChange={(e) => requestSetPreference('defaultHome', e.target.value)}
                  variant="filled"
                  disableUnderline
                  margin="dense"
                  classes={{
                    root: classes.select,
                  }}
                  className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
                >
                  <MenuItem dense value="home">Catalog</MenuItem>
                  <MenuItem dense value="browsers">Browsers</MenuItem>
                  <MenuItem dense value="installed">Installed</MenuItem>
                  <MenuItem dense value="preferences">Preferences</MenuItem>
                </Select>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Open at login" />
                <Select
                  value={openAtLogin}
                  onChange={(e) => requestSetSystemPreference('openAtLogin', e.target.value)}
                  variant="filled"
                  disableUnderline
                  margin="dense"
                  classes={{
                    root: classes.select,
                  }}
                  className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
                >
                  <MenuItem dense value="yes">Yes</MenuItem>
                  <MenuItem dense value="yes-hidden">Yes, but minimized</MenuItem>
                  <MenuItem dense value="no">No</MenuItem>
                </Select>
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" sx={classes.sectionTitle} ref={sections.advanced.ref}>
            Advanced
          </Typography>
          <Paper elevation={0} sx={classes.paper}>
            <List disablePadding dense>
              <ListItem
                button
                onClick={() => {
                  onOpenDialogSetPreferredEngine();
                }}
              >
                <ListItemText primary="Preferred browser engine" secondary={getEngineName(preferredEngine)} />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Installation path" />
                <Select
                  value="-"
                  renderValue={() => `${installationPath} ${requireAdmin && installationPath !== '~/Applications/Chromeless Apps' && installationPath !== '/Applications/Chromeless Apps' ? '(require sudo)' : ''}`}
                  onChange={(e) => {
                    const val = e.target.value;

                    if (val == null) return;

                    if (appCount > 0) {
                      window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
                        title: 'Uninstall all of Chromeless apps first',
                        message: 'You need to uninstall all of your Chromeless apps before changing this preference.',
                        buttons: ['OK'],
                        cancelId: 0,
                        defaultId: 0,
                      }).catch(console.log); // eslint-disable-line
                    } else {
                      requestSetPreference('requireAdmin', val.requireAdmin);
                      requestSetPreference('installationPath', val.installationPath);
                    }
                  }}
                  variant="filled"
                  disableUnderline
                  margin="dense"
                  classes={{
                    root: classes.select,
                  }}
                  className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
                  disabled={installingAppCount > 0}
                >
                  {(
                    [
                      (installationPath !== '~/Applications/Chromeless Apps' && installationPath !== '/Applications/WebCatalog Apps') && (
                        <MenuItem dense key="installation-path-menu-item" value={null}>
                          {installationPath}
                        </MenuItem>
                      ),
                      <MenuItem
                        dense
                        key="default-installation-path-menu-item"
                        value={{
                          installationPath: '~/Applications/Chromeless Apps',
                          requireAdmin: false,
                        }}
                      >
                        ~/Applications/Chromeless Apps (default)
                      </MenuItem>,
                      <MenuItem
                        dense
                        key="default-sudo-installation-path-menu-item"
                        value={{
                          installationPath: '/Applications/Chromeless Apps',
                          requireAdmin: true,
                        }}
                      >
                        /Applications/Chromeless Apps
                      </MenuItem>,
                    ]
                  )}
                  <MenuItem dense onClick={onOpenDialogSetInstallationPath}>
                    Custom
                  </MenuItem>
                </Select>
              </ListItem>
              <ListItem button onClick={requestOpenInstallLocation}>
                <ListItemText primary="Open installation path in Finder" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Use hardware acceleration when available"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={useHardwareAcceleration}
                    onChange={(e) => {
                      requestSetPreference('useHardwareAcceleration', e.target.checked);
                      enqueueRequestRestartSnackbar();
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" sx={classes.sectionTitle} ref={sections.updates.ref}>
            Updates
          </Typography>
          <Paper elevation={0} sx={classes.paper}>
            <List disablePadding dense>
              <ListItem
                button
                onClick={() => requestCheckForUpdates(false)}
                disabled={updaterStatus === 'checking-for-update'
                  || updaterStatus === 'download-progress'
                  || updaterStatus === 'download-progress'
                  || updaterStatus === 'update-available'}
              >
                <ListItemText
                  primary={updaterStatus === 'update-downloaded' ? 'Restart to Apply Updates' : 'Check for Updates'}
                  secondary={getUpdaterDesc(updaterStatus, updaterInfo)}
                />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Receive pre-release updates"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={allowPrerelease}
                    onChange={(e) => {
                      requestSetPreference('allowPrerelease', e.target.checked);
                      enqueueRequestRestartSnackbar();
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" sx={classes.sectionTitle} ref={sections.reset.ref}>
            Reset
          </Typography>
          <Paper elevation={0} sx={classes.paper}>
            <List disablePadding dense>
              <ListItem
                button
                onClick={() => {
                  window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
                    type: 'question',
                    buttons: ['Reset Now', 'Cancel'],
                    message: 'Are you sure? All preferences will be restored to their original defaults. Browsing data won\'t be affected. This action cannot be undone.',
                    cancelId: 1,
                  }).then(({ response }) => {
                    if (response === 0) {
                      window.ipcRenderer.once('set-preferences', () => {
                        enqueueRequestRestartSnackbar();
                      });
                      requestResetPreferences();
                    }
                  }).catch(console.log); // eslint-disable-line
                }}
              >
                <ListItemText primary="Restore preferences to their original defaults" />
                <ChevronRightIcon color="action" />
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" sx={classes.sectionTitle} ref={sections.moreApps.ref}>
            More Apps
          </Typography>
          <Paper elevation={0} sx={classes.paper}>
            <List disablePadding dense>
              <ListItem
                button
                onClick={() => requestOpenInBrowser(`https://webcatalog.io/webcatalog/?utm_source=${utmSource}`)}
                sx={classes.listItemPromotion}
              >
                <div sx={classes.promotionBlock}>
                  <div sx={classes.promotionLeft}>
                    <img src={webcatalogIconPng} alt="WebCatalog" sx={classes.appIcon} />
                  </div>
                  <div sx={classes.promotionRight}>
                    <div>
                      <Typography variant="body1" sx={classes.appTitle}>
                        WebCatalog
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Turn Any Websites Into Real Desktop Apps
                      </Typography>
                    </div>
                  </div>
                </div>
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={() => requestOpenInBrowser(`https://translatium.app?utm_source=${utmSource}`)}
                sx={classes.listItemPromotion}
              >
                <div sx={classes.promotionBlock}>
                  <div sx={classes.promotionLeft}>
                    <img src={translatiumIconPng} alt="Translatium" sx={classes.appIcon} />
                  </div>
                  <div sx={classes.promotionRight}>
                    <div>
                      <Typography variant="body1" sx={classes.appTitle}>
                        Translatium
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Translate 100+ Languages Instantly
                      </Typography>
                    </div>
                  </div>
                </div>
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={() => requestOpenInBrowser(`https://webcatalog.io/switchbar/?utm_source=${utmSource}`)}
                sx={classes.listItemPromotion}
              >
                <div sx={classes.promotionBlock}>
                  <div sx={classes.promotionLeft}>
                    <img src={switchbarIconPng} alt="Switchbar" sx={classes.appIcon} />
                  </div>
                  <div sx={classes.promotionRight}>
                    <div>
                      <Typography variant="body1" sx={classes.appTitle}>
                        Switchbar
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Browser & Email Client Picker
                      </Typography>
                    </div>
                  </div>
                </div>
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={() => requestOpenInBrowser(`https://webcatalog.io/singlebox/?utm_source=${utmSource}`)}
                sx={classes.listItemPromotion}
              >
                <div sx={classes.promotionBlock}>
                  <div sx={classes.promotionLeft}>
                    <img src={singleboxIconPng} alt="Singlebox" sx={classes.appIcon} />
                  </div>
                  <div sx={classes.promotionRight}>
                    <div>
                      <Typography variant="body1" sx={classes.appTitle}>
                        Singlebox
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        All-in-One Messenger
                      </Typography>
                    </div>
                  </div>
                </div>
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={() => {
                  const url = `https://webcatalog.io/clovery/?utm_source=${utmSource}`;
                  requestOpenInBrowser(url);
                }}
                sx={classes.listItemPromotion}
              >
                <div sx={classes.promotionBlock}>
                  <div sx={classes.promotionLeft}>
                    <img src={cloveryIconPng} alt="Clovery" sx={classes.appIcon} />
                  </div>
                  <div sx={classes.promotionRight}>
                    <div>
                      <Typography variant="body1" sx={classes.appTitle}>
                        Clovery
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        All Google Apps in One
                      </Typography>
                    </div>
                  </div>
                </div>
                <ChevronRightIcon color="action" />
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" sx={classes.sectionTitle} ref={sections.miscs.ref}>
            Miscellaneous
          </Typography>
          <Paper elevation={0} sx={classes.paper}>
            <List disablePadding dense>
              <ListItem button onClick={onOpenDialogAbout}>
                <ListItemText primary="About" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => requestOpenInBrowser('https://webcatalog.io/chromeless/?utm_source=chromeless_app')}>
                <ListItemText primary="Website" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => requestOpenInBrowser('https://webcatalog.io/chromeless/help/?utm_source=chromeless_app')}>
                <ListItemText primary="Help" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => requestOpenInBrowser(`https://webcatalog.io/privacy/?utm_source=${utmSource}`)}>
                <ListItemText primary="Privacy Policy" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={onOpenDialogOpenSourceNotices}>
                <ListItemText primary="Open Source Notices" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => requestOpenInBrowser('https://github.com/webcatalog/chromeless')}>
                <ListItemText primary="GitHub" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={requestQuit}>
                <ListItemText primary="Quit" />
                <ChevronRightIcon color="action" />
              </ListItem>
            </List>
          </Paper>
        </div>
      </div>
    </div>
  );
};

Preferences.defaultProps = {
  updaterInfo: null,
  updaterStatus: null,
};

Preferences.propTypes = {
  allowPrerelease: PropTypes.bool.isRequired,
  alwaysOnTop: PropTypes.bool.isRequired,
  appCount: PropTypes.number.isRequired,
  attachToMenubar: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  defaultHome: PropTypes.string.isRequired,
  installationPath: PropTypes.string.isRequired,
  installingAppCount: PropTypes.number.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogOpenSourceNotices: PropTypes.func.isRequired,
  onOpenDialogSetInstallationPath: PropTypes.func.isRequired,
  onOpenDialogSetPreferredEngine: PropTypes.func.isRequired,
  openAtLogin: PropTypes.oneOf(['yes', 'yes-hidden', 'no']).isRequired,
  preferredEngine: PropTypes.string.isRequired,
  requireAdmin: PropTypes.bool.isRequired,
  themeSource: PropTypes.string.isRequired,
  updaterInfo: PropTypes.object,
  updaterStatus: PropTypes.string,
  useHardwareAcceleration: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  allowPrerelease: state.preferences.allowPrerelease,
  alwaysOnTop: state.preferences.alwaysOnTop,
  appCount: Object.keys(state.appManagement.apps).length,
  attachToMenubar: state.preferences.attachToMenubar,
  defaultHome: state.preferences.defaultHome,
  installationPath: state.preferences.installationPath,
  installingAppCount: getInstallingAppsAsList(state).length,
  openAtLogin: state.systemPreferences.openAtLogin,
  preferredEngine: state.preferences.preferredEngine,
  requireAdmin: state.preferences.requireAdmin,
  themeSource: state.preferences.themeSource,
  updaterInfo: state.updater.info,
  updaterStatus: state.updater.status,
  useHardwareAcceleration: state.preferences.useHardwareAcceleration,
});

const actionCreators = {
  openDialogAbout,
  openDialogOpenSourceNotices,
  openDialogSetInstallationPath,
  openDialogSetPreferredEngine,
};

export default connectComponent(
  Preferences,
  mapStateToProps,
  actionCreators,
  styles,
);
