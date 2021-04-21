var express = require('express');
var http = require('http');
var path = require("path");
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");

var app = express();
var server = http.createServer(app);

const connectionString = 'postgresql://postgres:123456@localhost:5432/data-set-builder'

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || connectionString ,
  ssl: {
    rejectUnauthorized: false
  }
});

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

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM user1');
    const results = { 'results': (result) ? result.rows : null};
    res.send(results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

var porta = process.env.PORT || 8080;
server.listen(porta, function () {
  console.log("Server listening on port:" + porta);
})