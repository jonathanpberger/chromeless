/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';

import './index.css';

import store from './state';

// listeners to communicate with main process
import loadListeners from './listeners';

import AppWrapper from './components/app-wrapper';

loadListeners(store);

// Create a root using the new React 18 API
const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  </React.StrictMode>
);