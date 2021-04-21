var express = require('express');
var http = require('http');
var path = require("path");
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");

var app = express();
var server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(express.static(path.join(__dirname, './public')));
app.use(helmet());
app.use(limiter);


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/form.html'));
});

var porta = process.env.PORT || 8080;
server.listen(porta, function () {
  console.log("Server listening on port:" + porta);
})