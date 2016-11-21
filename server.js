/* node-static-server.js */
var http = require("http");
var express = require("express");
var serveStatic = require('serve-static');

var app = new express();

app.use(serveStatic(__dirname + '/'));
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

console.log("localhost端口3000")
app.listen(3000, "localhost");