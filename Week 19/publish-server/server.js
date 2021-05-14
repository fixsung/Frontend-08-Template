/*
 * @Author: songyzh
 * @Date: 2021-05-10 14:21:09
 * @LastEditors: songyzh
 * @LastEditTime: 2021-05-14 16:42:45
 * @Description:
 */
import http from "http";
import https from "https";
import unzipper from "unzipper";
import querystring from "querystring";

// 2.auth路由： 接受code 用code+client_id+client_secret 换取token
function auth(request, response) {
  let query = querystring.parse(request.url.match(/^\/auth\?([\s\S+])$/)[1]);
  getToken(query.code, function (info) {
    response.write(
      `<a href="http://localhost:8083/?token=${info.access_token}">publish</a>`
    );
    response.end();
  });
}

function getToken(code, callback) {
  let request = https.request(
    {
      hostname: "api.github.com",
      port: 443,
      path: `login/auth/access_token?code=${code}&client_id=xx&client_secret=xx`,
      method: "POST",
    },
    function (response) {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk.toString();
      });
      response.on("end", () => {
        callback(querystring.parse(body));
      });
    }
  );
  request.end();
}
// 4.publish路由：用token获取用户信息检查权限接受发布

function publish(request, response) {
  let query = querystring.parse(request.url.match(/^\/publish\?([\s\S+])$/)[1]);
  if (query.token) {
    getUser(query.token, (info) => {
      if (info.login === "xxx") {
        request.pipe(unzipper.Extract({ path: "./asset/" }));
      }
    });
  }
}

function getUser(token, callback) {
  let request = https.request(
    {
      hostname: "api.github.com",
      port: 443,
      path: `/user`,
      method: "GET",
      headers: { Authorization: `token ${token}`, "User-Agent": "toy-publish" },
    },
    function (response) {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk.toString();
      });
      response.on("end", () => {
        callback(JSON.parse(body));
      });
    }
  );
  request.end();
}
http
  .createServer((request, response) => {
    if (request.url.match(/^\/auth\?/)) {
      return auth(request, response);
    }
    if (request.url.match(/^\/pubish\?/)) {
      return publish(request, response);
    }
  })
  .listen(8082);
