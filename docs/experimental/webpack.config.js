//jshint esversion:6
let webpack = require('webpack');
let path = require('path');
let autoprefixer = require('autoprefixer');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let extractStyles = new ExtractTextPlugin('[name].css');

module.exports = {
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false
  },
  entry: {
    style: [
      path.resolve(__dirname, 'src/style.scss')
    ],
    bundle: [
      path.resolve(__dirname, 'src/main.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractStyles.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['latest', 'babili', 'react']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      options: {
        postcss: [
          autoprefixer({
            browsers: ['last 2 version', 'Explorer >= 10', 'Android >= 4']
          })
        ]
      }
    }),
    extractStyles
  ]
};
