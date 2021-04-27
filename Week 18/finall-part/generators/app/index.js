/*
 * @Author: songyzh
 * @Date: 2021-04-27 15:21:18
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-27 15:45:57
 * @Description:
 */

var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  async initPackage() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname, // Default to current folder name
      },
    ]);
    const pkgJson = {
      name: answers.name,
      version: "1.0.0",
      license: "MIT",
      dependencies: {},
      scripts: {
        test: "mocha --require @babel/register",
        coverage: "nyc mocha --require @babel/register",
        build: "npx webpack",
      },
    };
    console.log(this.npmInstall);
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }
  installDependencies() {
    this.npmInstall(["vue"], { "save-dev": false });
    this.npmInstall(
      [
        "babel-loader",
        "@babel/core",
        "@babel/register",
        "@babel/preset-env",
        "@istanbuljs/nyc-config-babel",
        "babel-plugin-istanbul",
        "mocha",
        "nyc",
        "vue-loader",
        "vue-template-compiler",
        "webpack",
        "vue-style-loader",
        "css-loader",
        "webpack-cli",
        "copy-webpack-plugin",
      ],
      {
        "save-dev": false,
      }
    );
  }

  copyFiles() {
    this.fs.copyTpl(
      this.templatePath("helloworld.vue"),
      this.destinationPath("src/helloworld.vue")
    );
    this.fs.copyTpl(
      this.templatePath("main.js"),
      this.destinationPath("src/main.js")
    );
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("src/index.html"),
      { title: "Templating with Yeoman" }
    );
    this.fs.copyTpl(
      this.templatePath("webpack.config.js"),
      this.destinationPath("webpack.config.js")
    );
    this.fs.copyTpl(
      this.templatePath("simple.test.js"),
      this.destinationPath("test/simple.test.js")
    );
    this.fs.copyTpl(
      this.templatePath(".babelrc"),
      this.destinationPath(".babelrc")
    );
    this.fs.copyTpl(
      this.templatePath(".nycrc"),
      this.destinationPath(".nycrc")
    );
  }
};
