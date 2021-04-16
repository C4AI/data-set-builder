var sqlite3 = require('sqlite3').verbose();
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


var db = new sqlite3.Database('./database/employees.db');


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.use(helmet());
app.use(limiter);

db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT)');

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'./public/form.html'));
  });

 // Insert
app.post('/add', function(req,res){
    db.serialize(()=>{
      db.run('INSERT INTO emp(id,name) VALUES(?,?)', [req.body.id, req.body.name], function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log("New employee has been added");
        res.send("New employee has been added into the database with ID = "+req.body.id+ " and Name = "+req.body.name);
      });
  });
  }); 

 // View
app.post('/view', function(req,res){
    db.serialize(()=>{
      db.each('SELECT id ID, name NAME FROM emp WHERE id =?', [req.body.id], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
        if(err){
          res.send("Error encountered while displaying");
          return console.error(err.message);
        }
        res.send(` ID: ${row.ID},    Name: ${row.NAME}`);
        console.log("Entry displayed successfully");
      });
    });
  }); 
//UPDATE
app.post('/update', function(req,res){
    db.serialize(()=>{
      db.run('UPDATE emp SET name = ? WHERE id = ?', [req.body.name,req.body.id], function(err){
        if(err){
          res.send("Error encountered while updating");
          return console.error(err.message);
        }
        res.send("Entry updated successfully");
        console.log("Entry updated successfully");
      });
    });
  });

  //DELETE
app.post('/delete', function(req,res){
    db.serialize(()=>{
      db.run('DELETE FROM emp WHERE id = ?', req.body.id, function(err) {
        if (err) {
          res.send("Error encountered while deleting");
          return console.error(err.message);
        }
        res.send("Entry deleted");
        console.log("Entry deleted");
      });
    });
  });

  app.get('/close', function(req,res){
    db.close((err) => {
      if (err) {
        res.send('There is some error in closing the database');
        return console.error(err.message);
      }
      console.log('Closing the database connection.');
      res.send('Database connection successfully closed');
    });
  }); 

  var porta = process.env.PORT || 8080;
  server.listen(porta,function(){ 
    console.log("Server listening on port:"+porta);})