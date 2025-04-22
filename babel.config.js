module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        electron: '28',
        node: '18',
        browsers: ['>0.2%', 'not dead', 'not op_mini all']
      },
      useBuiltIns: 'usage',
      corejs: 3
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }]
  ],
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