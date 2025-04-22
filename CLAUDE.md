# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Development Commands
- `yarn` - Install dependencies
- `yarn electron-dev` - Run development environment
- `yarn build` - Build React app and webpack
- `yarn dist` - Build for production
- `yarn dist-dev` - Build for development without code signing
- `yarn lint` - Run ESLint on main-src, src and dist.js
- `yarn lint-fix` - Run ESLint with auto-fix
- `yarn test` - Run Jest tests
- `yarn test:watch` - Run Jest tests in watch mode
- `yarn test:coverage` - Run Jest tests with coverage report

## Code Style Guidelines
- **License Header**: Include Mozilla Public License v2.0 header in all source files
- **ESLint Config**: Based on airbnb with project-specific modifications
- **Imports**: External dependencies first, then internal modules, then relative imports
- **Components**: Use PascalCase for React components with .js extension
- **Redux**: Use Redux Toolkit with createSlice for new redux modules
- **Naming**: Use camelCase for functions/variables, UPPER_SNAKE_CASE for constants
- **Styling**: Use MUI v5 styling with sx prop or styled API
- **PropTypes**: Define comprehensive PropTypes for all components
- **Error Handling**: Use try/catch blocks with proper error messages
- **Testing**: Write Jest tests for new functionality

## Project Structure
- `main-src/` - Electron main process code
- `src/` - React application code (components, state, helpers)
- `public/` - Static assets and HTML template
- `test/` - Jest test setup files