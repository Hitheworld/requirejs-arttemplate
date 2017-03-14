/* node-static-server.js */
var http = require("http");
var express = require("express");
var serveStatic = require('serve-static');

var app = new express();


app.use(serveStatic(__dirname + '/'));
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
	else  next();
});

console.log("localhost端口3000")
app.listen(3000, "localhost");