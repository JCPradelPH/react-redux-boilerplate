process.env.NODE_ENV = "development"; // development | production
const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const debug = process.env.NODE_ENV !== "production";
const buildPath = debug?'/':'./';
const extractSass = new ExtractTextPlugin({
    filename: "css/app.style.css",
    publicPath: buildPath,
    disable: debug
});
const styleLoaders = debug?[{
  loader: 'css-loader',
  options: { publicPath: './', sourceMap: true }
}]:[{
  loader: 'string-replace-loader',
  options: {
    multiple: [
      { search:'/css/fonts/', replace:'fonts/', flags:'g' },
      { search:'/css/webfonts/', replace:'webfonts/', flags:'g' }
    ]
  }
}, { loader: 'css-loader', options: { publicPath: buildPath, sourceMap: true } }
]
module.exports = {
  mode: process.env.NODE_ENV,
  performance: { hints: false },
  entry: {
    app: ['babel-polyfill','./src/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
    publicPath: buildPath
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['env','stage-0','react'],
          plugins: [ 'react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy' ]
        }
      },
      { test: /\.css$/, use: extractSass.extract({ fallback: 'style-loader', use: styleLoaders }) },
      { test: /\.(jpe?g|gif|png)$/, loader: 'file-loader?emitFile=false&name=[path][name].[ext]' }
    ]
  },
  devServer: { historyApiFallback: true },
  devtool: "inline-sourcemap",
  plugins: [
    new HtmlWebpackPlugin({ template:'./src/index.html' }),
    new Dotenv(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    extractSass
  ]
};
