/////////////////////////////NODEJS-SERVER-SIDE//////////////////////////////////

//////////////////////////////IMPORTS////////////////////////////////////////////
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

///////////////////////////////PORTA/////////////////////////////////////////////
var porta = process.env.PORT || 8082;
server.listen(porta, function () {
  console.log("Server listening on port:" + porta);
})

///////////////////////////////DATABASE//////////////////////////////////////////
const connectionString = 'postgresql://postgres:123456@localhost:5432/data-set-builder'

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

////////////////////////////////INICIAL//////////////////////////////////////////
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/1-login.html'));
});

////////////////////////////////USER/////////////////////////////////////////////
app.get('/user', async (req, res) => {
  try {
    const client = await pool.connect();
    const { email, iduser } = req.query;

    const result = await client
      .query('SELECT * from user1 where email = $1 and iduser = $2',
        [email, iduser]);

    res.send(JSON.stringify(result));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.post('/user', async (req, res) => {
  try {
    const client = await pool.connect();
    const { iduser, name, email, dateInsert, userAgreeTCLE } = req.body;
    const result = await client
      .query('INSERT INTO user1(iduser,name, email, dateinsert, useragreetlce) VALUES($1,$2,$3,$4,$5)',
        [iduser, name, email, dateInsert, userAgreeTCLE]
      );
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

////////////////////////////////ABSTRACT/////////////////////////////////////////////
app.get('/abstract', async (req, res) => {
  try {
    const client = await pool.connect();
    const { iduser } = req.query;

    const query1 = `    
    SELECT
      ar.idarticle, 
	  title,
      abstract, 
	  answer+1 as nquestions
    FROM article as ar
	inner join view1 as vi
	on ar.idarticle = vi.idarticle
	where view = 1 and
        reject = 0 and 
        skip = 0 and
		answer<3 and 
		iduser = $1
	LIMIT 1;`

    const query2 = `
    SELECT 
      ar.idarticle, 
	  title,
      abstract,
      COALESCE(vi.answer, 1) as nquestions
    FROM article as ar
	TABLESAMPLE SYSTEM(1) 
	left join view1 as vi
	on ar.idarticle = vi.idarticle
	where 
	vi.idarticle is null or (
    vi.iduser!=$1 and 
	vi.reject=0 and
	vi.answer<3 )
	LIMIT 1;`

    const query3 = `
    INSERT INTO view1(
      date, view, skip, reject, iduser, idarticle, answer)
      VALUES ((SELECT CURRENT_DATE), 1, 0, 0, $1, $2, 0);`;

    const result1 = await client
      .query(query1,
        [iduser]);

    if (result1.rowCount === 1)
      res.send(JSON.stringify(result1));
    else {
      const result2 = await client
        .query(query2,
          [iduser]);

      const idArticle = result2.rows[0].idarticle;

     await client
        .query(query3,
          [iduser, idArticle]);

      res.send(JSON.stringify(result2));
    }
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.post('/abstract/reject', async (req, res) => {
  try {
    const client = await pool.connect();
    const { iduser, idArticle } = req.body;
    const query = `
    UPDATE view1
  	SET reject= reject + 1
	  WHERE iduser = $1 and idarticle = $2;`;

    const result = await client
      .query(query,
        [iduser, idArticle]);

    res.send(JSON.stringify(result));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.post('/abstract/skip', async (req, res) => {
  try {
    const client = await pool.connect();
    const { iduser, idArticle } = req.body;
    const query = `
    UPDATE view1
  	SET skip= skip + 1
	  WHERE iduser = $1 and idarticle = $2;`;

    const result = await client
      .query(query,
        [iduser, idArticle]);

    res.send(JSON.stringify(result));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.post('/question-answer', async (req, res) => {
  try {
    const client = await pool.connect();
    const { questionen, answeren, questionpt, answerpt, iduser, idarticle } = req.body;
    const query1 = `
      INSERT INTO questionanswer(questionen, answeren, questionpt, answerpt,
        date, iduser, idarticle)
      VALUES ($1 ,$2, $3, $4,
              (SELECT CURRENT_DATE), $5, $6); `;

    const result = await client
        .query(query1,
            [questionen, answeren, questionpt, answerpt,
              iduser, idarticle]);

    res.send(JSON.stringify(result));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
app.get('/question-answer/count', async (req, res) => {
  try {
    const client = await pool.connect();
    const { iduser, idarticle } = req.query;

    const query = `
      SELECT COUNT(*) as nquestions FROM questionanswer
      WHERE iduser =$1 AND idarticle = $2; `;

    const result = await client
        .query(query,
            [iduser, idarticle]);

    res.send(JSON.stringify(result));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
