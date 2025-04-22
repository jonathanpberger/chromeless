# Chromeless Updates - Version 5.0.0

This document outlines the major updates and changes in the 5.0.0 release of Chromeless.

## Major Upgrades

- **Node.js**: Updated from v16 to v18+
- **Electron**: Updated from v16 to v28
- **React**: Migrated from v16 to v18
- **Material-UI**: Upgraded from v4 to MUI v5
- **Redux**: Integrated Redux Toolkit for improved state management
- **Webpack**: Updated from v4 to v5

## New Features

### Browser Support
- Added support for Arc Browser
- Added support for Opera GX and Opera One
- Added support for Firefox Developer Edition and Firefox Nightly
- Firefox is no longer marked as experimental

### Performance & UX
- Added keyboard shortcuts for common operations
- Improved component rendering with React.memo
- Improved dark mode support
- Enhanced the application bar and navigation components

### Security Improvements
- Updated to Electron's modern security model with contextIsolation
- Replaced direct IPC exposure with contextBridge API
- Converted synchronous IPC methods to asynchronous pattern
- Limited Node.js API access from renderer process

## Developer Improvements

### Modern React Patterns
- Implemented React 18's createRoot API
- Added custom hooks for common patterns
- Improved state management with Redux Toolkit

### Testing
- Added Jest configuration
- Added component tests
- Added Redux slice tests
- Added custom hook tests

### Documentation
- Added developer documentation for IPC communication
- Added modernization guide
- Updated README with new features and capabilities

## Migration Guide

If you have built applications using Chromeless or extended the application, please note:

1. **IPC Communication**: All synchronous IPC calls should be migrated to use the new async pattern. Legacy sync methods are deprecated and will log warnings.

2. **Redux State**: The Redux store has been modernized with Redux Toolkit. Use the new slice-based approach for state management.

3. **MUI Components**: Update all Material-UI imports to use the new MUI v5 pattern.

## Known Issues

- Custom browser icons are using fallback icons temporarily
- Some components still need optimization for React 18's concurrent features
- Some legacy code patterns remain and will be addressed in future updates