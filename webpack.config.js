const path = require('path');

module.exports = {
  watch: true,
  entry: './src/ScrollFx.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ScrollFx.js',
    libraryTarget: 'window',
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      }, ],
  },
};
