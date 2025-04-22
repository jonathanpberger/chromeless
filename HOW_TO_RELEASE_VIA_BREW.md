Step 1: Get the New Release Assets Ready

  First, make sure your new version (5.0.0) has a DMG
   file available for download. When your GitHub
  Actions workflow completes successfully, it should
  produce a DMG file attached to the GitHub release.

  Step 2: Download the DMG and Calculate SHA256

  # Download the new DMG
  curl -L
  https://github.com/jonathanpberger/chromeless/relea
  ses/download/v5.0.0/Chromeless-5.0.0-universal.dmg
  -o /tmp/Chromeless-5.0.0-universal.dmg

  # Calculate the SHA256 hash
  shasum -a 256 /tmp/Chromeless-5.0.0-universal.dmg

  Note the SHA256 hash that is output.

  Step 3: Clone Your Tap Repository

  # If you don't already have it locally
  git clone
  https://github.com/jonathanpberger/homebrew-tap.git
  cd homebrew-tap

  Step 4: Edit the Formula File

  # Edit the formula file
  nano Casks/chromeless.rb

  Update these lines:
  cask "chromeless" do
    version "5.0.0"  # Change from 4.6.0 to 5.0.0
    sha256 "NEW_SHA256_HASH_HERE"  # Paste the new 
  SHA256 hash

    url "https://github.com/jonathanpberger/chromeles
  s/releases/download/v#{version}/Chromeless-#{versio
  n}-universal.dmg"
    # ...
  end

  Make sure to:
  1. Update the version number to 5.0.0
  2. Replace the SHA256 hash with the one you
  calculated
  3. Ensure the URL pattern is correct (adjust if
  your DMG has a different naming pattern)

  Step 5: Commit and Push the Changes

  # Add the changes
  git add Casks/chromeless.rb

  # Commit with a descriptive message
  git commit -m "Update Chromeless to v5.0.0"

  # Push to GitHub
  git push origin main

  Step 6: Test the Update

  After pushing the changes, you and your users can
  update Chromeless:

  # Update Homebrew to see the new formula
  brew update

  # Upgrade Chromeless
  brew upgrade --cask jonathanpberger/tap/chromeless

  Alternative: Use the Existing Homebrew-Tap-Setup 
  Directory

  If you already have the homebrew-tap-setup
  directory that we created earlier:

  cd
  /Users/jpb/workspace/chromeless/homebrew-tap-setup

  # Edit the formula
  nano Casks/chromeless.rb
  # [Make the changes as described above]

  # Commit and push
  git add Casks/chromeless.rb
  git commit -m "Update Chromeless to v5.0.0"
  git push origin main

  That's it! Your users will now be able to install
  or upgrade to the new version of Chromeless using
  Homebrew.