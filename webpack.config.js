const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'], // Resolve these extensions for imports
    alias: {
      '@': path.resolve(__dirname, 'src'), // Set up '@' as alias for 'src'
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env) // Inject process.env for client-side
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 4096 // Adjust memory limit if needed
      },
      async: false, // Synchronous mode reduces memory load
      eslint: {
        files: "./src/**/*.{ts,tsx}" // Only lint .ts and .tsx files
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
};
