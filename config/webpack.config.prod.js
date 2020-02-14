const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const env = process.env.NODE_ENV;

module.exports = {
  mode: env,

  entry: {
    main: './app/js/app.js',
  },
  output: {
    filename: '[name]-bundle[contenthash:6].js',
    path: path.resolve(__dirname,'../', 'build'),
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: 'raw-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpg|png|svg|gif|jpeg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name][contenthash:6].[ext]',
            outputPath: 'images',
          }
        },
        {
          loader: 'image-webpack-loader'
          // ,
          // options: {
          //   mozjpeg: {
          //     quality: 70,
          //     progressive: true
          //   }
          // }
        }
        ]

      },
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
          ]
        }
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      title: "nowa aplikacja",
      minify: {
        collapseWhitespace: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: "[id].css"
    }),
    new CopyPlugin(
      [
        {
          from: 'app/images',
          to: 'build/images'
        }
      ]
    )
  ]
}
