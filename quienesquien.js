var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

app.get('/', function(req, res) {
   res.sendfile('index.html')
})

//Whenever someone connects this gets executed
let users = 0
io.on('connection', socket =>{
   console.log('A user connected')
   users++
   if (users == 1){
       io.emit('esperando', {})
   }else if(users == 2){
      MongoClient.connect(url, (err, db) =>{
         if (err) throw err;
         var dbo = db.db("quien");
         dbo.collection("personaje").find({}).toArray((err, result) =>{
         if (err) throw err
         
         db.close()
         io.emit('empieza', result)
         });
      });
   }

   socket.on('pregunta', preg =>{
      io.broadcast('pregunta', preg)
   })

   socket.on('respuesta', resp =>{
      io.broadcast('respuesta', resp)
   })

   socket.on('gano', () =>{
      io.broadcast('gano')
   })

   socket.on('arriesga', arr =>{
      io.broadcast('arriesga', arr)
   })

   socket.on('arriesgaResp', arrR =>{
      io.broadcast('arriesgaResp', arrR)
   })

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', () =>{
      io.broadcast('gano')
      console.log('A user disconnected')
   })
})

http.listen(3000, () =>{
   console.log('listening on *:3000')
})