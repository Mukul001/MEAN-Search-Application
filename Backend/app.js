//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/test';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.route("/")

.get(

    function(req,response){
      //response.sendFile(__dirname + 'index.html');
      console.log("In get");
    }
)

.post(
  
  function(req,response){

  MongoClient.connect(url, {useUnifiedTopology: true,
    useNewUrlParser: true}, function(err, db) 
    {
       if (err) throw err;
        var dbo = db.db("test");

       dbo.collection('vehicles').aggregate([
        { $lookup:
          {
            from: 'policies',
            localField: '_id',
            foreignField: 'vehicleId',
            as: 'policydetails'
          }
        },
        { $unwind: "$policydetails"},
        {
          $lookup:
          {
            from: 'inspections',
            localField: '_id',
            foreignField: 'vehicleId',
            as: 'inspectiondetails'
          }
        },
        { $unwind: "$inspectiondetails"},
        {
          $lookup:
          {
            from: 'claims',
            localField: 'policies',
            foreignField: 'policyId',
            as: 'claimdetails'
          }
        },
        {$unwind: "$claimdetails"},
    
        {
          $project: {
            _id:1,
            regNumber: 1,
            inspection_id: "$inspectiondetails._id",
            policiesId: "$policydetails._id",
            claimId: "$claimdetails._id",
          }
        },
        { $match : { "regNumber" : req.body.regNumber } },
          ]).toArray(function(err, result) 
          {
            if (err) throw err;
              result.forEach(element => { 
                //var str = JSON.stringify(element);
                response.send(element); 
              
              Object.keys(element).forEach(function(key) {
              //console.log(key, element[key]);
            }); 
            });
            db.close();
          });
    });
    
  });

app.listen(3000, ()=> {
  console.log("Server started on port 3000");
});





// app.get("/search",(req,response)=>{
//   response.send(element);
// });

// app.post("/search",(req,response)=>{
// response.send(element);
// });

//     const query = req.body.cityName;
//     const apikey = "f36dd46db0f5790c9483fb62f53bd3a4";
//     const units = "metric";
//     const url = "https://api.openweathermap.org/data/2.5/forecast?APPID=" + apikey +"&q=" + query +"&units="+ units;
    
// https.get(url,function(res){
//         console.log(res.statusCode);

// res.on("data", function(data){
//     const weatherData = JSON.parse(data)
//     const temp = weatherData.list[0].main.temp;
//     const description= weatherData.list[0].weather[0].description;
//     console.log(description,temp);
   
//     // const icon = weatherData.list[0].main.icon;
//     // const imageURL="http://openweathermap.org/img/wn/" + icon + "@2x.png";

// response.write("The temp in "+ query+" is " + temp);
// response.write(" Description is " + description);    
// //response.write("<img src=" + imageURL+ ">");
// response.send();
//     });
// });
//  app.route("/:keyword")
//  .post(function(req,response){
//   db.vehicles.findOne({regNumber: req.params.keyword}, function(err, foundVehicles){
//     if(foundVehicles) {
//       response.send(foundVehicles);
//     } else {
//       response.send("No vehicle found");
//     } console.log(foundVehicles);
//  })
// });

// var express = require('express');
// var bodyParser = require('body-parser');
// var mongodb = require('mongodb'),
//   MongoClient = mongodb.MongoClient;
// var assert = require('assert');

// var app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));

// var db;

// MongoClient.connect(process.env.MONGOHQ_URL, function(err, database) {
//   db = database;
//   db.collection("textstore", {}, function(err, coll) {
//     if (err != null) {
//       db.createCollection("textstore", function(err, result) {
//         assert.equal(null, err);
//       });
//     }
//     db.ensureIndex("textstore", {
//       document: "text"
//     }, function(err, indexname) {
//       assert.equal(null, err);
//     });
//     app.listen(3000);
//   });
// });



// app.get("/", function(req, res) {
//   res.sendfile("./views/index.html");
// });

// app.get("/add", function(req, res) {
//   res.sendfile('./views/add.html');
// });

// app.post("/add", function(req, res) {
//   db.collection('textstore').insert({
//     document: req.body.newDocument,
//     created: new Date()
//   }, function(err, result) {
//     if (err == null) {
//       res.sendfile("./views/add.html");
//     } else {
//       res.send("Error:" + err);
//     }
//   });
// });

// app.get("/search", function(req, res) {
//   res.sendfile('./views/search.html');
// });

// app.post("/search", function(req, res) {
//   db.collection('textstore').find({
//     "$text": {
//       "$search": req.body.query
//     }
//   }, {
//     document: 1,
//     created: 1,
//     _id: 1,
//     textScore: {
//       $meta: "textScore"
//     }
//   }, {
//     sort: {
//       textScore: {
//         $meta: "textScore"
//       }
//     }
//   }).toArray(function(err, items) {
//     res.send(pagelist(items));
//   })
// });

// function pagelist(items) {
//   result = "<html><body><ul>";
//   items.forEach(function(item) {
//     itemstring = "<li>" + item._id + "<ul><li>" + item.textScore +
//       "</li><li>" + item.created + "</li><li>" + item.document +
//       "</li></ul></li>";
//     result = result + itemstring;
//   });
//   result = result + "</ul></body></html>";
//   return result;
// }
