var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
var app = express();
var server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const { Client } = require('pg');
const pg = require('pg');
const pool = new pg.Pool();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));
app.use(helmet());
app.use(limiter);

pool.connect(function (err, client, done) {
  if (err) {
    return console.error('connexion error', err);
  }
  client.query('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT)',
    function (err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      console.log('Create table')
    });
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/form.html'));
});

app.post('/add', function (req, res) {

  pool.connect(function (err, client, done) {
    if (err) {
      return console.error('connexion error', err);
    }
    client.query('INSERT INTO emp(id,name) VALUES(?,?)',
      [req.body.id, req.body.name], function (err, result) {
        done();
        if (err) {
          return console.error('error running query', err);
        }
        console.log("New question has been added");
        res.send("New question has been added into the database with ID = " + req.body.id + " and Answer = " + req.body.name);
      });
  })
});


var porta = process.env.PORT || 8080;
server.listen(porta, function () {
  console.log("Server listening on port:" + porta);
})