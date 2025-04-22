/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createSlice } from '@reduxjs/toolkit';

import {
  ROUTE_HOME, ROUTE_INSTALLED, ROUTE_PREFERENCES, ROUTE_BROWSERS,
} from '../../constants/routes';

import { getPreference } from '../../senders';

// Determine the default route based on user preferences
let defaultRoute;
switch (getPreference('defaultHome')) {
  case 'browsers': {
    defaultRoute = ROUTE_BROWSERS;
    break;
  }
  case 'installed': {
    defaultRoute = ROUTE_INSTALLED;
    break;
  }
  case 'preferences': {
    defaultRoute = ROUTE_PREFERENCES;
    break;
  }
  default: {
    defaultRoute = ROUTE_HOME;
  }
}

const routerSlice = createSlice({
  name: 'router',
  initialState: {
    route: defaultRoute,
  },
  reducers: {
    changeRoute: (state, action) => {
      state.route = action.payload;
    },
  },
});

export const { changeRoute } = routerSlice.actions;

export default routerSlice.reducer;