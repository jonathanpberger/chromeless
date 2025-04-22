# Publishing Chromeless to Homebrew

This guide explains how to publish Chromeless as a Homebrew Cask formula.

## Prerequisites

1. A GitHub release with the DMG file
2. Homebrew installed on your system
3. Basic familiarity with Git and GitHub

## Steps to Publish to Homebrew

### 1. Get the SHA256 hash of your DMG file

Download the DMG from your GitHub release, then run:

```bash
shasum -a 256 path/to/Chromeless-5.0.0.dmg
```

### 2. Update the Homebrew Cask formula

Edit the `homebrew-cask/chromeless.rb` file:
- Replace `:no_check` with the actual SHA256 hash
- Verify the URL points to your release asset

### 3. Test the formula locally

```bash
# Copy the formula to your local Homebrew tap
cp homebrew-cask/chromeless.rb $(brew --repository)/Library/Taps/homebrew/homebrew-cask/Casks/c/

# Test installation
brew install --cask chromeless

# If it works, uninstall for testing
brew uninstall --cask chromeless
```

### 4. Submit to Homebrew Cask

Fork the Homebrew Cask repository:
https://github.com/Homebrew/homebrew-cask

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/homebrew-cask.git
cd homebrew-cask

# Create a branch
git checkout -b add-chromeless

# Add your formula
cp /path/to/chromeless.rb Casks/c/

# Commit
git add Casks/c/chromeless.rb
git commit -m "Add Chromeless v5.0.0"

# Push to your fork
git push origin add-chromeless
```

### 5. Create a Pull Request

Go to your fork on GitHub and create a pull request to the main Homebrew Cask repository.

### 6. Alternative: Create Your Own Tap

If you don't want to wait for the PR to be approved, you can create your own tap:

```bash
# Create a new GitHub repository named homebrew-tap

# Clone it
git clone https://github.com/YOUR_USERNAME/homebrew-tap.git
cd homebrew-tap

# Add your formula
mkdir -p Casks
cp /path/to/chromeless.rb Casks/

# Commit and push
git add Casks/chromeless.rb
git commit -m "Add Chromeless v5.0.0"
git push

# Users can then install with:
brew tap YOUR_USERNAME/tap
brew install --cask YOUR_USERNAME/tap/chromeless
```

## Updating the Formula

When you release a new version:

1. Update the version in the formula
2. Update the SHA256 hash
3. Submit a new PR to Homebrew or update your own tap

## Additional Resources

- [Homebrew Cask Documentation](https://docs.brew.sh/Cask-Cookbook)
- [Homebrew Cask Style Guide](https://docs.brew.sh/Cask-Cookbook#style-guide)