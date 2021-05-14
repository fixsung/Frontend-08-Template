/*
 * @Author: songyzh
 * @Date: 2021-05-10 14:15:37
 * @LastEditors: songyzh
 * @LastEditTime: 2021-05-14 13:58:43
 * @Description:
 */
import http from "http";
import fs from "fs";
import archiver from "archiver";
import child_process from "child_process";
import querystring from "querystring";

//1. 打开https://github.com/login/oauth/authorize
child_process.exec(
  "open https://github.com/login/oauth/authorize?client_id=xxx"
);

// 3.创建server 接受token 点击发布
http
  .createServer((request, response) => {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S+])$/)[1]);
    publish(token);
  })
  .listen(8083);

function publish(token) {
  let request = http.request(
    {
      hostname: "127.0.0.1",
      port: 8082,
      method: "POST",
      path: "/publish?token=" + token,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    },
    (response) => {
      // console.log(response);
    }
  );

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.directory("./assets/");
  archive.finalize();
  archive.pipe(request);
}
