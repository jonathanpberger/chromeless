/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Transform image imports to file path strings for Jest
const path = require('path');

module.exports = {
  process(src, filename) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(filename))};`,
    };
  },
};