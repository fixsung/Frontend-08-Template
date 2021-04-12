/*
 * @Author: songyzh
 * @Date: 2021-04-09 10:02:48
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-12 16:09:52
 * @Description:
 */
module.exports = {
  entry: "./animation_demo.js",
  output: {
    filename: "demo.js",
  },
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
