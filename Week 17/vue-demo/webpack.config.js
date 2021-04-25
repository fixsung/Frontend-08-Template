/*
 * @Author: songyzh
 * @Date: 2021-04-25 10:55:39
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-25 15:15:55
 * @Description:
 */
const { VueLoaderPlugin } = require("vue-loader");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  entry: "./src/main.js",
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [{ from: "src/*.html", to: "[name].[ext]" }],
    }),
  ],
  mode: "development",
};
