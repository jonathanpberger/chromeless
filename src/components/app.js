/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';
import useKeyboardShortcuts from '../helpers/use-keyboard-shortcuts';

import EnhancedBottomNavigation from './root/enhanced-bottom-navigation';
import SnackbarTrigger from './root/snackbar-trigger';

import Installed from './pages/installed';
import Home from './pages/home';
import Preferences from './pages/preferences';
import Browsers from './pages/browsers';

import DialogAbout from './dialogs/dialog-about';
import DialogChooseEngine from './dialogs/dialog-choose-engine';
import DialogCreateCustomApp from './dialogs/dialog-create-custom-app';
import DialogEditApp from './dialogs/dialog-edit-app';
import DialogOpenSourceNotices from './dialogs/dialog-open-source-notices';
import DialogSetInstallationPath from './dialogs/dialog-set-installation-path';
import DialogSetPreferredEngine from './dialogs/dialog-set-preferred-engine';

import {
  ROUTE_PREFERENCES,
  ROUTE_INSTALLED,
  ROUTE_BROWSERS,
} from '../constants/routes';
import {
  requestGetInstalledApps,
  requestCheckForUpdates,
} from '../senders';

import { fetchLatestTemplateVersionAsync } from '../state/general/slice';
import { changeRoute } from '../state/router/slice';
import { open as openDialogAbout } from '../state/dialog-about/slice';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
    background: theme.palette.background.default,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  notistackContainerRoot: {
    // substract 22px of FakeTitleBar
    marginTop: window.process.platform === 'darwin' && window.mode !== 'menubar' ? 64 : 42,
  },
});

const App = (props) => {
  const {
    classes,
    route,
    onFetchLatestTemplateVersionAsync,
    onChangeRoute,
    onOpenDialogAbout,
  } = props;
  
  const updaterTimerRef = useRef(null);

  useEffect(() => {
    // Initial setup on mount
    requestCheckForUpdates(true); // isSilent = true
    requestGetInstalledApps();
    onFetchLatestTemplateVersionAsync();
    
    // Set up interval for checking updates
    updaterTimerRef.current = setInterval(() => {
      onFetchLatestTemplateVersionAsync();
    }, 15 * 60 * 1000); // recheck every 15 minutes
    
    // Cleanup on unmount
    return () => {
      if (updaterTimerRef.current) {
        clearInterval(updaterTimerRef.current);
      }
    };
  }, [onFetchLatestTemplateVersionAsync]);

  // Set up keyboard shortcuts
  const shortcuts = [
    {
      key: ',', // Command/Ctrl + , = Preferences
      meta: true,
      action: useCallback(() => onChangeRoute(ROUTE_PREFERENCES), [onChangeRoute]),
    },
    {
      key: 'h', // Command/Ctrl + H = Home
      meta: true,
      action: useCallback(() => onChangeRoute(ROUTE_BROWSERS), [onChangeRoute]),
    },
    {
      key: 'i', // Command/Ctrl + I = Installed
      meta: true,
      action: useCallback(() => onChangeRoute(ROUTE_INSTALLED), [onChangeRoute]),
    },
    {
      key: 'r', // Command/Ctrl + R = Refresh
      meta: true,
      action: useCallback(() => {
        requestGetInstalledApps();
        onFetchLatestTemplateVersionAsync();
      }, [onFetchLatestTemplateVersionAsync]),
    },
    {
      key: 'a', // Command/Ctrl + A = About
      meta: true,
      action: useCallback(() => onOpenDialogAbout(), [onOpenDialogAbout]),
    },
  ];
  
  useKeyboardShortcuts(shortcuts);

  // Determine which page to show based on current route
  let pageContent;
  switch (route) {
    case ROUTE_PREFERENCES:
      pageContent = <Preferences key="preferences" />;
      break;
    case ROUTE_INSTALLED:
      pageContent = <Installed key="installed" />;
      break;
    case ROUTE_BROWSERS:
      pageContent = <Browsers key="browsers" />;
      break;
    default:
      pageContent = <Home key="home" />;
  }

  return (
    <div sx={classes.root}>
      <div sx={classes.content}>
        {pageContent}
      </div>
      <EnhancedBottomNavigation />

      <SnackbarTrigger />

      <DialogAbout />
      <DialogChooseEngine />
      <DialogCreateCustomApp />
      <DialogEditApp />
      <DialogOpenSourceNotices />
      <DialogSetInstallationPath />
      <DialogSetPreferredEngine />
    </div>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  route: PropTypes.string.isRequired,
  onFetchLatestTemplateVersionAsync: PropTypes.func.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isFullScreen: state.general.isFullScreen,
  route: state.router.route,
});

const actionCreators = {
  fetchLatestTemplateVersionAsync,
  changeRoute,
  openDialogAbout,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);