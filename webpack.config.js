'use strict';

let path = require('path');

module.exports = {
  mode: 'development',
  entry: './scripts/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/scripts/build'
  },
  watch: true,

  devtool: "source-map",

  module: {}
};
