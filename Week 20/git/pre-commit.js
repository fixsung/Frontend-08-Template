/*
 * @Author: songyzh
 * @Date: 2021-05-24 13:23:28
 * @LastEditors: songyzh
 * @LastEditTime: 2021-05-24 13:23:46
 * @Description:
 */
#!/usr/bin/env node

let process = require('process');
let child_process = require('child_process');
const { ESLint } = require("eslint");

function exec(name) {
	return new Promise(function(resolve) { child_process.exec(name, resolve) });
}

(async function main() {
  const eslint = new ESLint({ fix: false });

	await exec("git stash push -k");

  const results = await eslint.lintFiles(["index.js"]);

	await exec("git stash pop");

  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  console.log(resultText);

	for (let result of results) {
		if (result.errorCount) {
			process.exitCode = 1;
		}
	}
})().catch((error) => {
	console.log('eslint failed')
  process.exitCode = 1;
  console.error(error);
});