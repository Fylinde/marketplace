const webpack = require('webpack');

module.exports = {
  // other configuration options...
  plugins: [
    new webpack.ProvidePlugin({
        process: 'process/browser',
    })
  ]
};
