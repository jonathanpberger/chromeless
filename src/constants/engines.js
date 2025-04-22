/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import braveIcon from '../assets/brave.png';
import chromeIcon from '../assets/chrome.png';
import chromeBetaIcon from '../assets/chrome-beta.png';
import chromeDevIcon from '../assets/chrome-dev.png';
import chromeCanaryIcon from '../assets/chrome-canary.png';
import chromiumIcon from '../assets/chromium.png';
import coccocIcon from '../assets/coccoc.png';
import edgeIcon from '../assets/edge.png';
import edgeBetaIcon from '../assets/edge-beta.png';
import edgeDevIcon from '../assets/edge-dev.png';
import edgeCanaryIcon from '../assets/edge-canary.png';
import firefoxIcon from '../assets/firefox.png';
import operaIcon from '../assets/opera.png';
import vivaldiIcon from '../assets/vivaldi.png';
import webkitIcon from '../assets/webkit.png';
import yandexIcon from '../assets/yandex.png';

// Temporary fallback solution until we have proper icons
// When adding the official icons, replace these with actual imports
const arcIcon = chromiumIcon;
const firefoxDevIcon = firefoxIcon;
const firefoxNightlyIcon = firefoxIcon;
const operaGXIcon = operaIcon;
const operaOneIcon = operaIcon;

const engines = {
  chrome: {
    engineName: 'Google Chrome',
    iconPath: chromeIcon,
    downloadUrl: 'https://www.google.com/chrome/',
  },
  edge: {
    engineName: 'Microsoft Edge',
    iconPath: edgeIcon,
    downloadUrl: 'https://www.microsoft.com/edge',
  },
  brave: {
    engineName: 'Brave',
    iconPath: braveIcon,
    downloadUrl: 'https://brave.com/',
  },
  vivaldi: {
    engineName: 'Vivaldi',
    iconPath: vivaldiIcon,
    downloadUrl: 'https://vivaldi.com/',
  },
  yandex: {
    engineName: 'Yandex Browser',
    iconPath: yandexIcon,
    downloadUrl: 'https://browser.yandex.com/',
  },
  chromium: {
    engineName: 'Chromium',
    iconPath: chromiumIcon,
    downloadUrl: 'https://www.chromium.org/getting-involved/download-chromium',
  },
  coccoc: {
    engineName: 'Cốc Cốc',
    iconPath: coccocIcon,
    downloadUrl: 'https://coccoc.com/',
  },
  opera: {
    engineName: 'Opera',
    iconPath: operaIcon,
    disableStandardMode: true,
    defaultMode: 'tabbed',
    downloadUrl: 'https://www.opera.com/',
  },
  webkit: {
    engineName: 'WebKit',
    iconPath: webkitIcon,
    disableTabbedMode: true,
    disableMultisiteMode: true,
  },
  firefox: {
    engineName: 'Mozilla Firefox',
    iconPath: firefoxIcon,
    disableStandardMode: false, // Firefox support is no longer experimental
    defaultMode: 'tabbed',
    downloadUrl: 'https://www.mozilla.org/firefox/',
  },
  chromeBeta: {
    engineName: 'Google Chrome Beta',
    iconPath: chromeBetaIcon,
    downloadUrl: 'https://www.google.com/chrome/beta/',
  },
  chromeDev: {
    engineName: 'Google Chrome Dev',
    iconPath: chromeDevIcon,
    downloadUrl: 'https://www.google.com/chrome/dev/',
  },
  chromeCanary: {
    engineName: 'Google Chrome Canary',
    iconPath: chromeCanaryIcon,
    downloadUrl: 'https://www.google.com/chrome/canary/',
  },
  edgeBeta: {
    engineName: 'Microsoft Edge Beta',
    iconPath: edgeBetaIcon,
    downloadUrl: 'https://www.microsoft.com/edge/download/insider',
  },
  edgeDev: {
    engineName: 'Microsoft Edge Dev',
    iconPath: edgeDevIcon,
    downloadUrl: 'https://www.microsoft.com/edge/download/insider',
  },
  edgeCanary: {
    engineName: 'Microsoft Edge Canary',
    iconPath: edgeCanaryIcon,
    downloadUrl: 'https://www.microsoft.com/edge/download/insider',
  },
  // Added browser engines:
  firefoxDeveloperEdition: {
    engineName: 'Firefox Developer Edition',
    iconPath: firefoxDevIcon,
    downloadUrl: 'https://www.mozilla.org/firefox/developer/',
  },
  firefoxNightly: {
    engineName: 'Firefox Nightly',
    iconPath: firefoxNightlyIcon,
    downloadUrl: 'https://www.mozilla.org/firefox/nightly/',
  },
  operaGX: {
    engineName: 'Opera GX',
    iconPath: operaGXIcon,
    disableStandardMode: true,
    defaultMode: 'tabbed',
    downloadUrl: 'https://www.opera.com/gx',
  },
  operaOne: {
    engineName: 'Opera One',
    iconPath: operaOneIcon,
    disableStandardMode: true,
    defaultMode: 'tabbed',
    downloadUrl: 'https://www.opera.com/one',
  },
  arc: {
    engineName: 'Arc Browser',
    iconPath: arcIcon,
    downloadUrl: 'https://arc.net/',
  },
};

export default engines;