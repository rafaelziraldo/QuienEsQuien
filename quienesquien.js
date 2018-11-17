var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

app.get('/', function (req, res) {
    res.sendfile('index.html')
})

//Whenever someone connects this gets executed
let users = []
let turno = 0
io.on('connection', socket => {
    console.log('A user connected')
    if (users.length == 1) {
        users.push(socket)
        io.emit('esperando', {})
    } else if (users.length == 2) {
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
            socket.emit('error', 'no te toca')
        }
        turno++
        socket.broadcast.emit('pregunta', preg)
    })

    socket.on('respuesta', resp => {
        socket.broadcast.emit('respuesta', resp)
    })

    socket.on('gano', () => {
        if (users[turno%users.length] != socket){
            socket.emit('error', 'no te toca')
        }
        turno++
        socket.broadcast.emit('gano')
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