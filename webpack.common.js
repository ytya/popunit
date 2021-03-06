var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyFilePlugin = require('copy-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;

module.exports = (mode) => {
  const enabledSourceMap = mode == "development";  // 
  return {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: mode,

    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: './src/ts/index.ts',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: './js/[name].js',
      //publicPath: '/'
    },

    module: {
      rules: [
        {
          // 拡張子 .ts の場合
          test: /\.ts$/,
          exclude: /__tests__/,
          use: 'ts-loader',
        },
        {
          test: /\.(sc|c|sa)ss$/,
          use: [
            //style-loader",
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                // オプションでCSS内のurl()メソッドの取り込みを禁止する
                url: false,
                // ソースマップの利用有無
                sourceMap: enabledSourceMap,

                // 0 => no loaders (default);
                // 1 => postcss-loader;
                // 2 => postcss-loader, sass-loader
                importLoaders: 2
              }
            },
            {
              loader: "sass-loader",
              options: {
                // ソースマップの利用有無
                sourceMap: enabledSourceMap
              }
            }
          ]
        }
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.ejs',
        filename: path.resolve(__dirname, 'dist', 'index.html'),
        hash: true
      }),
      new MiniCssExtractPlugin(),
      new CopyFilePlugin({
        patterns: [
          { from: "./src/image", to: "./image" }
        ]
      }),
      new SitemapPlugin({
        base: 'https://ytya.github.io',
        paths: ['/popunit/'],
        options: {
          filename: 'sitemap.xml',
          lastmod: true,
          changefreq: 'monthly'
        }
      })
    ],
    // import 文で .ts ファイルを解決するため
    // これを定義しないと import 文で拡張子を書く必要が生まれる。
    // フロントエンドの開発では拡張子を省略することが多いので、
    // 記載したほうがトラブルに巻き込まれにくい。
    resolve: {
      // 拡張子を配列で指定
      extensions: [
        '.ts', '.js',
      ]
    }
  }
}
