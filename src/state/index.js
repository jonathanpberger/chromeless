/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { configureStore } from '@reduxjs/toolkit';

import appManagement from './app-management/reducers';
import dialogAbout from './dialog-about/reducers';
import dialogChooseEngine from './dialog-choose-engine/reducers';
import dialogCreateCustomApp from './dialog-create-custom-app/reducers';
import dialogEditApp from './dialog-edit-app/reducers';
import dialogOpenSourceNotices from './dialog-open-source-notices/reducers';
import dialogSetInstallationPath from './dialog-set-installation-path/reducers';
import dialogSetPreferredEngine from './dialog-set-preferred-engine/reducers';
import browsers from './browsers/reducers';
import general from './general/slice';
import installed from './installed/reducers';
import preferences from './preferences/reducers';
import router from './router/reducers';
import systemPreferences from './system-preferences/reducers';
import updater from './updater/reducers';

// Configure the store with Redux Toolkit
const store = configureStore({
  reducer: {
    appManagement,
    dialogAbout,
    dialogChooseEngine,
    dialogCreateCustomApp,
    dialogEditApp,
    dialogOpenSourceNotices,
    dialogSetInstallationPath,
    dialogSetPreferredEngine,
    browsers,
    general,
    installed,
    preferences,
    router,
    systemPreferences,
    updater,
  },
  // Enable serializable check in development only
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: process.env.NODE_ENV === 'development',
  }),
});

export default store;