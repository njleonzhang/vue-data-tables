var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var env = config.demo.env

var webpackConfig = merge(baseWebpackConfig, {
  entry: {
    app: './example/main.js'
  },
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  devtool: config.demo.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.demo.assetsRoot,
    filename: 'demo.js',
    publicPath: config.demo.assetsPublicPath
  },
  vue: {
    loaders: utils.cssLoaders({
      sourceMap: config.demo.productionSourceMap
    })
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'example/index.html',
      inject: true
    })
  ]
})

module.exports = webpackConfig
