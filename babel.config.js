/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

module.exports = function(api) {
  // This caches the Babel config
  api.cache.using(() => process.env.NODE_ENV);
  
  const presets = [
    // For backward compatibility with react-scripts
    'babel-preset-env',
    'babel-preset-react',
    
    // Modern presets
    [
      '@babel/preset-env',
      {
        targets: {
          electron: '28',
          node: '18',
          browsers: ['>0.2%', 'not dead', 'not op_mini all']
        },
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ]
  ];
  
  const plugins = [
    ['@babel/plugin-transform-runtime', {
      regenerator: true
    }]
  ];
  
  return {
    presets,
    plugins,
    env: {
      test: {
        presets: [
          ['@babel/preset-env', {
            targets: {
              node: 'current'
            }
          }]
        ]
      }
    }
  };
};