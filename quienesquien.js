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
io.on('connection', function(socket) {
   console.log('A user connected')
   users++
   if (users == 1){
       io.emit('esperando', {})
   }else if(users == 2){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("quien");
            dbo.collection("personaje").find({}).toArray(function(err, result) {
            if (err) throw err;
            
            db.close();
            io.emit('empieza', result)
            });
        });
   }
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected')
   })
})

http.listen(3000, function() {
   console.log('listening on *:3000')
})