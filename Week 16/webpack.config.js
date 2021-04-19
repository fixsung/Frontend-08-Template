/*
 * @Author: songyzh
 * @Date: 2021-04-16 16:35:34
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-16 16:58:45
 * @Description:
 */
const path = require("path");
module.exports = {
  entry: "./main.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                { pragma: "createElement" },
              ],
            ],
          },
        },
      },
    ],
  },

  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "lib"),
    },
  },

  mode: "development",
};
