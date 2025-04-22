module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead'],
          node: '10'
        },
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ]
};