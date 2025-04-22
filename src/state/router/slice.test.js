/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import reducer, { changeRoute } from './slice';
import { ROUTE_HOME, ROUTE_INSTALLED, ROUTE_PREFERENCES } from '../../constants/routes';

jest.mock('../../senders', () => ({
  getPreference: jest.fn(() => 'home'),
}));

describe('router slice', () => {
  const initialState = {
    route: ROUTE_HOME,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle changeRoute action', () => {
    const previousState = initialState;
    
    // Test changing to ROUTE_INSTALLED
    expect(reducer(previousState, changeRoute(ROUTE_INSTALLED))).toEqual({
      route: ROUTE_INSTALLED,
    });
    
    // Test changing to ROUTE_PREFERENCES
    expect(reducer(previousState, changeRoute(ROUTE_PREFERENCES))).toEqual({
      route: ROUTE_PREFERENCES,
    });
    
    // Test changing back to ROUTE_HOME
    expect(reducer({
      route: ROUTE_PREFERENCES,
    }, changeRoute(ROUTE_HOME))).toEqual({
      route: ROUTE_HOME,
    });
  });
});