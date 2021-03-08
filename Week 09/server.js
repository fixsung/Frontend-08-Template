/*
 * @Author: songyzh
 * @Date: 2021-03-01 13:56:42
 * @LastEditors: songyzh
 * @LastEditTime: 2021-03-03 15:05:58
 */
const http = require("http");

http
  .createServer((request, response) => {
    let body = [];

    request
      .on("error", (error) => {
        console.log(error);
      })
      .on("data", (chunk) => {
        body.push(chunk.toString());
      })
      .on("end", () => {
        body = body.join("");
        console.log("body:", body);
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(`<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Document</title><style>#img {
width: 100px;
height: 100px;
background-color: #fff000;}
img {
width: 100px;
height: 100px;
background-color: #fff000;
}
</style>
</head>
<body>
<div>
<img id="img" src="xxx" />
<img />
</div>
</body>
</html>`);
      });
  })
  .listen(8088);

console.log("server started");
