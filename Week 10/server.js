/*
 * @Author: songyzh
 * @Date: 2021-03-01 13:56:42
 * @LastEditors: songyzh
 * @LastEditTime: 2021-03-05 17:02:29
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
        response.end(`<html lang="en"><head><style>#container {
width: 500px;
height: 300px;
background-color: #fff000;
display:flex;
background-color:rgb(255,255,255)
}
#container #myid {
width: 200px;
height: 100px;
background-color: rgb(255,0,0);
}
#container .cl {
  flex:1;
  background-color: rgb(0,255,0);
  }
</style>
</head>
<body>
<div id="container">
<div id="myid"></div>
<div class="cl"></div>
</div>
</body>
</html>`);
      });
  })
  .listen(8088);

console.log("server started");
