/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

module.exports = {
  parser: "@babel/eslint-parser",
  extends: "airbnb",
  globals: {
    window: true,
    document: true
  },
  plugins: [
    "header"
  ],
  rules: {
    "header/header": [2, "build-resources/copyright.txt"],
    "import/no-extraneous-dependencies": [0],
    "react/jsx-filename-extension": [1, { "extensions": [".js"] }],
    "react/forbid-prop-types": [0],
    "import/prefer-default-export": [0],
    "camelcase": [0],
    "linebreak-style": [0],
    "react/function-component-definition": [0],
    "react/react-in-jsx-scope": [0],
    "react/jsx-props-no-spreading": [0]
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src']
      }
    }
  },
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ["env", "react"]
    }
  }
}