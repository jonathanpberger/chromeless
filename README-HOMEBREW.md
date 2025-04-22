# Installing Chromeless with Homebrew

Chromeless can be installed on macOS using Homebrew, which makes installation and updates seamless.

## Installation

### Option 1: Using the Official Homebrew Cask

If our PR has been accepted into the official Homebrew repository, you can install Chromeless with:

```bash
brew install --cask chromeless
```

### Option 2: Using Our Tap

If you can't wait for the PR to be accepted or want the latest development version, you can use our tap:

```bash
# Add our tap
brew tap webcatalog/tap

# Install Chromeless
brew install --cask webcatalog/tap/chromeless
```

## Updating

To update Chromeless to the latest version:

```bash
brew upgrade --cask chromeless
```

## Uninstalling

To uninstall Chromeless:

```bash
brew uninstall --cask chromeless
```

## Homebrew Information

To get information about the Chromeless cask:

```bash
brew info --cask chromeless
```

## Troubleshooting

If you encounter any issues:

1. Update Homebrew: `brew update`
2. Try reinstalling: `brew reinstall --cask chromeless`
3. File an issue on our GitHub repository

## Alternative Installation Methods

If you prefer not to use Homebrew, you can:

1. Download the DMG directly from our [GitHub Releases](https://github.com/webcatalog/chromeless/releases)
2. Build from source (see our [README.md](./README.md) for instructions)