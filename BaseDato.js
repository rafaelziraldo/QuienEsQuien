var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/llenarBaseDatosPersonaje',function(){
var personaje=[];
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  for(var i=0;i<personajes.length;i++){
  var myobj = { personaje: "Company Inc" };
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
    dbo.collection("personaje").findOne({}, function(err, result) {
      if (err) throw err;
      
      db.close();
    });
  });
})
