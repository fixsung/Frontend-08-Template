/*
 * @Author: songyzh
 * @Date: 2021-04-09 10:02:48
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-09 10:12:21
 * @Description:
 */
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
  mode: "development",
};
