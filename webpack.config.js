const path = require('path');
const webpack = require('webpack');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const copyPlugin = require('copy-webpack-plugin');

const env = process.env.NODE_ENV;

module.exports = {
  entry: './app/js/app.js',

  // mode: development,
  mode: env,

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    // publicPath: ''
  },

  devServer: {
    open: true,
    contentBase: path.resolve(__dirname,'./public'),
    compress: true,
    port: 3500,
    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            ["@babel/preset-env", { useBuiltIns: 'usage', corejs: "2.0.0" }]
          ],
          plugins: [
            "@babel/plugin-proposal-class-properties"
          ]}
      },
      {
        test: /\.(jpg|png|svg|gif|jpeg)$/,
        use: 'file-loader',
        // loader: 'file-loader',
        // options: {
          // name: '[name][contenthash:6].[ext]',
          // outputPath: 'images',
          // publicPath: '../images'
        // }
      },
      // {
      //   test: /\.(sa|sc|c)ss$/,
      //   use: [
      //     env == 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
      //     'css-loader',
      //     'postcss-loader',
      //     'sass-loader'
      //   ]
      // }
        {
          test: /\.txt$/,
          use: 'raw-loader'
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        },
        {
          test: /\.(jpg|png|svg|gif|jpeg)$/,
          use: 'file-loader',
        }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      title: "nowa aplikacja"}),
    new webpack.HotModuleReplacementPlugin(),
    // new MiniCssExtractPlugin({
    //   // Options similar to the same options in webpackOptions.output
    //   // both options are optional
    //   filename: "[name].css",
    //   chunkFilename: "[id].css"
    // }),
    new copyPlugin([{
      from: 'app/images',
      to: 'dist/images'
    }])
  ]
};
