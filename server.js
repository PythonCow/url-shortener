var app = require("express")();
var mongo = require("mongodb").MongoClient;


app.get("/:id", function(request, response){
  //Find id in database and send appropriate url.
  mongo.connect("mongodb://pythoncow:shrek420@ds141474.mlab.com:41474/pythoncow", function(err, db){
    if(err) throw err;
    var urls = db.collection("urls");
    urls.find({_id: parseInt(request.params.id)}).toArray(function(err, results){
      if(results[0]!== undefined){
        response.send("<!DOCTYPE html>\n<script>window.location='https://"+results[0].url+"'</script>");
      } else {
        response.send("<!DOCTYPE html>\n<h1>404 Not Found.</h1>")
      }
    });
  })
});

app.get("/new/:url", function(request, response){
  //Insert url into database and send id and url back.
  mongo.connect("mongodb://pythoncow:shrek420@ds141474.mlab.com:41474/pythoncow", function(err, db){
    if(err) throw err;
    var urls = db.collection("urls");
    urls.aggregate([
      {$group: {
        _id: "Largest_Id",
        largest_id: {$max: "$_id"}
      }}
    ]).toArray(function(err, results){
      if(err) throw err;
      var id = results[0].largest_id+1;
      urls.insert({
        _id: id,
        url: request.params.url
      }, function(err){
        if(err) throw err;
      });
      response.send({
        "shortened-url": "https://"+request.headers.host+"/"+id
      });
    });
  });
});

app.listen(process.env.PORT);
