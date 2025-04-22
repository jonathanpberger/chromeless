cask "chromeless" do
  version "4.6.0"
  sha256 "0fc90c25e97ffd84c7e6f2d7af52eb6ca27a4efdfc57dfc4cdce32af3d8fdbae"

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