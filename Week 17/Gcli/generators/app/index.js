/*
 * @Author: songyzh
 * @Date: 2021-04-23 15:30:57
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-25 15:14:58
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
    };
    console.log(this.npmInstall);
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }
  installDependencies() {
    this.npmInstall(["vue"], { "save-dev": false });
    this.npmInstall(
      [
        "babel-loader",
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
  }
};
