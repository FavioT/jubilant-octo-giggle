var express = require('express');
var pg = require("pg");
var cors = require("cors");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var connectionString = "postgres://favio1:favio1@localhost:5432/testdb";

app.use(cors());
//app.options('*', cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.post('/', function(req, res) {
  pg.connect(connectionString,function(err,client,done) {
     if(err){
         console.log("not able to get connection "+ err);
         res.status(400).send(err);
     }
     client.query('SELECT * FROM persona;', function(err,result) {
         done(); // closing the connection;
         if(err){
             console.log(err);
             res.status(400).send(err);
         }
         res.status(200).send(result.rows);
     });
  });
});

app.get('/', function (req, res, next) {
    pg.connect(connectionString,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }
       client.query('SELECT * FROM persona;', function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

app.get('/getid/:id', function (req, res, next) {
    pg.connect(connectionString,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }
       client.query('SELECT idpersona FROM alumno WHERE legajo = ' + req.params.id + ';', function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

// 3.A
app.post('/registerstudent', function (req, res, next) {
    var name = req.param('name');
    var doc = req.param('doc');
    var lastname = req.param('lastname');
    var birthday = req.param('birthday');
    var id = req.param('id');

    pg.connect(connectionString,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }
       client.query("INSERT INTO persona VALUES (" + id + ",'DNI', " + doc +", '"+ name + "', '" + lastname + "', '" + birthday + "');", function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

// 3.A
app.post('/update', function (req, res, next) {
    var name = req.param('name');
    var doc = req.param('doc');
    var lastname = req.param('lastname');
    var birthday = req.param('birthday');
    var id = req.param('id');

    pg.connect(connectionString,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }
       client.query("UPDATE persona SET nombre = '" + name +"', apellido = '" + lastname + "', documento = '"+ doc +"', fechanac = '" + birthday + "' WHERE identificador = "+ id +";", function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

// 3.B.1
app.get('/academicinfo/:idpersona', function (req, res, next) {
    pg.connect(connectionString,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }
       client.query("SELECT INS_CU.idalumno, CU.nombre, CU.descripcion, CU.profesor, INS_CU.nota, INS_CA.idcarrera, CARR.nombre AS carrera FROM inscripciones_curso INS_CU JOIN curso CU ON INS_CU.idcurso = CU.identificador JOIN inscripciones_carrera INS_CA ON INS_CA.idalumno = 1 JOIN carrera CARR ON INS_CA.idcarrera = CARR.identificador WHERE INS_CU.idalumno = " + req.params.idpersona + ";", function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

// 3.B.2
app.get('/getclass/:name', function (req, res, next) {
    var name = req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1);
    pg.connect(connectionString,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }
       client.query("SELECT INS_CU.idalumno, PER.nombre, PER.apellido, CU.nombre AS clase, CU.profesor from curso CU JOIN inscripciones_curso INS_CU ON INS_CU.idcurso = CU.identificador JOIN persona PER ON PER.identificador = INS_CU.idalumno WHERE CU.nombre = '"+ name  +"';", function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

// 3.C

app.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
})
