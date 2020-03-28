'use strict';
const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const os = require('os');
const getIPAdress = function(){
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
module.exports = {
  entry: {
    index:path.resolve(__dirname, './index.ts')
  },
  output: {
    path: path.resolve(__dirname, './prod'),
    filename: 'index.js'
  },
  devServer: {
    contentBase: path.join(__dirname, "./prod/"),
    compress: true,
    port: 9000,
    host:getIPAdress()
  },

    // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",


  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".js", ".json", ".scss"]
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader",
          options: {
            modules: true,
            localIdentName: '[path][name]__[local]--[hash:base64:5]'
          }
        }, {
          loader: "postcss-loader",
          options: {
            sourceMap: true,
            plugins: [
              require('autoprefixer')(),
              require('cssnano')()
            ]
          }
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      },

      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },

  plugins: [
    new htmlWebpackPlugin({   //创建一个在内存中生成html插件

      template: path.join(__dirname, './index.html'),  // 指定模板页面, 将来会根据指定的页面路径, 去生成内存中的页面
      filename: path.join(__dirname, './prod/index.html')  // 指定生成内存中的页面
    }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      parallel: true,
      include: /.*?\.min\.js/i,
      output: {
        comments: false
      },
      mangle: true,
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new CopyWebpackPlugin([
      {from: path.resolve(__dirname, '../src/video-js.swf'), to: path.resolve(__dirname, './prod/dist/video-js.swf')}
    ]),
    new webpack.optimize.ModuleConcatenationPlugin() // bootstrap optimize. detail: https://medium.com/webpack/brief-introduction-to-scope-hoisting-in-webpack-8435084c171f
  ]
};
