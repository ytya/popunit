const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common.js');

module.exports = merge(common('production'), {
  // バンドルサイズ確認時は外す
//   plugins: [
//     new BundleAnalyzerPlugin()
//   ]
})
