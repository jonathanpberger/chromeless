# Migration Guide for Chromeless v5

This document outlines the key changes made to modernize Chromeless from v4.6.0 to v5.0.0.

## Key Technology Updates

1. **Node.js**: Updated from Node.js 16 to Node.js 18+ 
2. **Electron**: Updated from Electron 16 to Electron 28+
3. **React**: Updated from React 16 to React 18
4. **UI Library**: Migrated from Material-UI v4 to MUI v5
5. **Redux**: Updated Redux ecosystem and added Redux Toolkit
6. **Build Tools**: Upgraded webpack from v4 to v5

## Component Migration Guide

### Material UI v4 to MUI v5

- `withStyles` has been replaced with the new styled API
- `createMuiTheme` is now `createTheme`
- `ThemeProvider` is now imported from `@mui/material/styles` 
- `palette.type` is now `palette.mode`
- All MUI component imports should now come from `@mui/material` instead of `@material-ui/core`
- All MUI icon imports should now come from `@mui/icons-material` instead of `@material-ui/icons`

Example:
```jsx
// Old
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

// New 
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
```

### React 18 Changes

- ReactDOM.render has been replaced with createRoot
- Added StrictMode for better development experience

### Redux Updates

- Now using Redux Toolkit for better developer experience
- Use `configureStore` instead of `createStore`
- Reducers are now more concise with `createSlice`
- Redux Thunk is now included by default

## File Structure

The project structure remains largely the same, with some updated configuration files:

- Package dependencies in `package.json` have been updated
- Webpack configuration in `webpack.config.js` has been modernized
- ESLint configuration in `.eslintrc` has been updated

## Component Styling

The `connectComponent` helper has been updated to use MUI v5's `styled` API instead of the deprecated `withStyles`.

## Running the Project

The commands to run the project remain the same:

```bash
# Install dependencies 
yarn

# Run in development mode
yarn electron-dev

# Build for production
yarn dist
```