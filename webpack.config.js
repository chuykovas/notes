'use strict';

let path = require('path');

module.exports = {
  mode: 'development',
  entry: './scripts/app.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/scripts'
  },
  watch: true,

  devtool: "source-map",

  module: {}
};
