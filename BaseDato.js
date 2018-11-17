var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/llenarBaseDatosPersonaje',function(){
var personaje=[{nombre:feredico,ruta:federico.jpg},{nombre:rafael,ruta:rafael.jpg},{nombre:diego,ruta:diego.jpg},
    {nombre:maria,ruta:maria.jpg},{nombre:juan,ruta:juan.jpg},{nombre:sergio,ruta:sergio.jpg},{nombre:santino,ruta:santino.jpg},
    {nombre:sergio,ruta:sergio.jpg}];
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  for(var i=0;i<personajes.length;i++){
  var myobj=personaje[i];
  dbo.collection("personaje").insertOne(myobj, function(err, res) {
    if (err) throw err;
    
  
    db.close();
  
  });
}
});
});

app.get('/traerPersonaje',function(){
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("personaje").findAll({}, function(err, result) {
      if (err) throw err;
      
      db.close();
    });
  });
})
