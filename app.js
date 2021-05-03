var express = require('express');
var http = require('http');
var path = require("path");
var helmet = require('helmet');
var bodyParser = require('body-parser')
var app = express()

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, './public')));
app.use(helmet());

var server = http.createServer(app);

const connectionString = 'postgresql://postgres:123456@localhost:5432/data-set-builder'

var porta = process.env.PORT || 8082;
server.listen(porta, function () {
  console.log("Server listening on port:" + porta);
})

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/1-login.html'));
});

app.get('/user', async (req, res) => {
  try {
    const client = await pool.connect();
    const { email, idUser } = req.query;

    const result = await client
      .query('SELECT * from user1 where email = $1 and idUser = $2',
        [email, idUser]);

    res.send(JSON.stringify(result));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})


app.get('/user/all', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM user1');
    const results = { 'results': (result) ? result.rows : null };
    res.send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.post('/user', async (req, res) => {
  try {
    const client = await pool.connect();
    const { idUser, name, email, dateInsert, userAgreeTCLE } = req.body;
    const result = await client
      .query('INSERT INTO user1(idUser,name, email, dateInsert, userAgreeTCLE) VALUES($1,$2,$3,$4)',
        [idUser, name, email, dateInsert, userAgreeTCLE]
      );
    res.send(JSON.stringify(result));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/abstract', async (req, res) => {
  try {
    const client = await pool.connect();
    const { idUser } = req.query;
    const query1 = `
    SELECT 
      idarticle, 
      abstract 
    FROM article 
    where idarticle in 
      (select 
        idarticle 
        from 
      view1 
      where 
        view = 1 and 
        reject = 0 and 
        skip = 0 and 
        iduser = $1) 
    LIMIT 1`;

    const query2 = `
    SELECT 
      idarticle, 
      abstract 
    FROM article 
    TABLESAMPLE SYSTEM(1) 
    where idarticle not in 
      (select 
        idarticle 
      from view1 
      where 
        view>0 or 
        iduser=$1) 
    LIMIT 1`

    const result1 = await client
      .query(query1,
        [idUser]);

    const result2 = await client
      .query(query2,
        [idUser]);

    if (result1.rowCount == 1)
      res.send(JSON.stringify(result1));
    else
      res.send(JSON.stringify(result2));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})