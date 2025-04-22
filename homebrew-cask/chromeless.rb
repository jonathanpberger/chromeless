cask "chromeless" do
  version "5.0.0"
  sha256 :no_check # Replace with actual SHA256 of your DMG file once you have the build

  url "https://github.com/webcatalog/chromeless/releases/download/v#{version}/Chromeless-#{version}.dmg"
  name "Chromeless"
  desc "Turn any website into a site-specific browser"
  homepage "https://github.com/webcatalog/chromeless"

  auto_updates true

  app "Chromeless.app"

  zap trash: [
    "~/Library/Application Support/Chromeless",
    "~/Library/Caches/com.webcatalog.chromeless",
    "~/Library/Caches/com.webcatalog.chromeless.ShipIt",
    "~/Library/Logs/Chromeless",
    "~/Library/Preferences/com.webcatalog.chromeless.plist",
    "~/Library/Saved Application State/com.webcatalog.chromeless.savedState"
  ]
end