var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

app.get('/', function (req, res) {
    res.sendfile('index.html')
})
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("quien");
    dbo.collection("personaje").drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
      db.close();
    });
  });

var personaje=[{nombre:"feredico",ruta:"federico.jpg"},{nombre:"rafael",ruta:"rafael.jpg"},{nombre:"diego",ruta:"diego.jpg"},
    {nombre:"maria",ruta:"maria.jpg"},{nombre:"juan",ruta:"juan.jpg"},{nombre:"sergio",ruta:"sergio.jpg"},{nombre:"santino",ruta:"santino.jpg"},
    {nombre:"sergio",ruta:"sergio.jpg"}];
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("quien");
  
  
  dbo.collection("personaje").insertMany(personaje, function(err, res) {
    if (err) throw err;
    
  
    db.close();
  
  });

});

//Whenever someone connects this gets executed
let users = []
let turno = 0
io.on('connection', socket => {
    console.log('A user connected')
    if (users.length == 0) {
        users.push(socket)
        io.emit('esperando', {})
    } else if (users.length == 1) {
        users.push(socket)
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db("quien");
            dbo.collection("personaje").find({}).toArray((err, result) => {
                if (err) throw err

                db.close()
                io.emit('empieza', result)
            });
        });
    }

    socket.on('pregunta', preg => {
        if (users[turno%users.length] != socket){
            socket.emit('noTeToca', 'no te toca')
        }else{
            turno++
            socket.broadcast.emit('pregunta', preg)
        }
    })

    socket.on('respuesta', resp => {
        socket.broadcast.emit('respuesta', resp)
    })

    socket.on('gano', () => {
        if (users[turno%users.length] != socket){
            socket.emit('noTeToca', 'no te toca')
        }else{
            turno++
            socket.broadcast.emit('gano')
        }
    })

    socket.on('arriesga', arr => {
        socket.broadcast.emit('arriesga', arr)
    })

    socket.on('arriesgaResp', arrR => {
        socket.broadcast.emit('arriesgaResp', arrR)
    })

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
        socket.broadcast.emit('gano')
        console.log('A user disconnected')
    })
})

http.listen(3000, () => {
    console.log('listening on *:3000')
})