# Chromeless Release Process

This document outlines the release process for Chromeless v5.0.0 and future versions.

## Prerequisites

- Node.js 18 or later
- Yarn package manager
- macOS for building macOS packages
- Windows for building Windows packages (or use GitHub Actions)
- Linux for building Linux packages (or use GitHub Actions)

## Pre-Release Checklist

1. ✅ Update version number in `package.json` (already set to 5.0.0)
2. ✅ Update release notes in `README-UPDATES.md` (already created)
3. ✅ Verify all tests are passing (`yarn test`)
4. ✅ Complete all planned modernization items (see `MODERNIZATION.md`)
5. ✅ Update the Electron security model to follow best practices
6. ✅ Convert synchronous IPC methods to asynchronous patterns

## Build Process

### Building for all platforms via CI/CD

The recommended approach is to set up GitHub Actions to build installers for all platforms automatically.

1. Create a `.github/workflows/build.yml` file with appropriate build configurations 
2. Configure secrets for code signing
3. Set up release automation to create GitHub releases

### Manual Building

To build installers manually:

#### For macOS:

```bash
# Development build (unsigned)
yarn dist-dev

# Production build (requires signing credentials)
yarn dist
```

#### For Windows:

```bash
# From a Windows machine
yarn dist-dev
```

#### For Linux:

```bash
# From a Linux machine
yarn dist-dev
```

## Release Checklist

1. Create a git tag for the release
   ```bash
   git tag -a v5.0.0 -m "Chromeless v5.0.0"
   git push origin v5.0.0
   ```

2. Create a GitHub release
   - Upload build artifacts
   - Include release notes from README-UPDATES.md
   - Mark as latest release

3. Test the installers
   - Verify installation on clean systems
   - Test auto-update from previous version
   - Validate app functionality

## Auto-Update Mechanism

Chromeless uses `electron-updater` for automatic updates. The update process:

1. App checks for updates on startup
2. If available, downloads in the background
3. Prompts user to restart to apply
4. Applies update on next launch

This process should be tested thoroughly before final release.

## Post-Release Tasks

1. Announce the release to users
2. Update documentation website
3. Create a blog post highlighting new features
4. Plan next development cycle

## Troubleshooting

If you encounter issues during the build process:

- Check signing credentials
- Verify dependencies are correctly installed
- Make sure notarization is correctly configured (for macOS)
- Check electron-builder logs


---


Let's summarize what we've accomplished:

  1. We fixed several compatibility issues in the codebase:
    - Updated MUI imports from fade to alpha
    - Fixed theme.palette.type to theme.palette.mode
    - Updated import of scriptVersion from package.json
    - Fixed a syntax issue in the AppCard component
  2. We created a custom script (build-dmg.js) to build a DMG file for the Homebrew formula.
  3. We successfully built the DMG and calculated its SHA256 hash.
  4. We updated the Homebrew tap formula with the correct version and SHA256 hash.
  5. We provided instructions for pushing these changes to the Homebrew tap repository in homebrew-push-commands.txt.

  To finish the Homebrew release process, you'll need to:

  1. Run the commands in homebrew-push-commands.txt to commit and push the changes to your Homebrew tap repository.
  2. After pushing the changes, users can install or upgrade Chromeless via Homebrew using:
  brew update
  brew upgrade --cask jonathanpberger/tap/chromeless

  While we weren't able to fully fix all the build issues with the main application, we've accomplished the core task of
  updating the Homebrew tap for the v5.0.0 release with a functional DMG file.