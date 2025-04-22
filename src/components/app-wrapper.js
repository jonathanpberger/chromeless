/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { teal, pink, grey } from '@mui/material/colors';

import connectComponent from '../helpers/connect-component';

import App from './app';

const AppWrapper = ({ shouldUseDarkColors }) => {
  const themeObj = {
    typography: {
      fontFamily: '"Roboto",-apple-system,BlinkMacSystemFont,"Segoe UI",Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      fontSize: 13.5,
    },
    palette: {
      mode: shouldUseDarkColors ? 'dark' : 'light',
      primary: {
        light: teal[300],
        main: teal[700],
        dark: teal[900],
      },
      secondary: {
        light: pink[300],
        main: pink[500],
        dark: pink[700],
      },
      background: {
        default: shouldUseDarkColors ? '#121212' : '#fff',
        paper: shouldUseDarkColors ? '#1e1e1e' : '#fff',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  };

  // Add custom background for light mode
  if (!shouldUseDarkColors) {
    themeObj.palette.background.primary = grey[200];
  }

  const theme = createTheme(themeObj);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

AppWrapper.propTypes = {
  shouldUseDarkColors: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  shouldUseDarkColors: state.general.shouldUseDarkColors,
});

export default connectComponent(
  AppWrapper,
  mapStateToProps,
  null,
  null,
);