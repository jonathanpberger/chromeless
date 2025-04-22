/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import AppCard from './app-card';
import { INSTALLED } from '../../constants/app-statuses';

// Create a mock store with minimal state for testing
const createMockStore = (customState = {}) => {
  return configureStore({
    reducer: {
      appManagement: (state = { apps: {} }, action) => state,
      general: (state = { latestTemplateVersion: '1.0.0' }, action) => state,
    },
    preloadedState: {
      appManagement: {
        apps: {
          'test-app': {
            id: 'test-app',
            name: 'Test App',
            icon: 'test-icon.png',
            engine: 'chrome',
            status: INSTALLED,
            cancelable: false,
            opts: {},
            version: '1.0.0',
          },
        },
      },
      ...customState,
    },
  });
};

// Mock the remote functions
window.remote = {
  Menu: {
    buildFromTemplate: jest.fn(() => ({
      popup: jest.fn(),
    })),
  },
  getCurrentWindow: jest.fn(),
};

describe('AppCard component', () => {
  it('renders correctly for installed app', () => {
    const store = createMockStore();
    
    const { container } = render(
      <Provider store={store}>
        <AppCard
          id="test-app"
          name="Test App"
          icon="test-icon.png"
          cancelable={false}
          isOutdated={false}
        />
      </Provider>
    );
    
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Uninstall')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});