require('./config/config');
require('./models/db');
require('./config/passportConfig');
require('./controllers/user.controller');
require('./controllers/myController')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
var MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017/test';

const rtsIndex = require('./routes/index.router');
var myController = require('./controllers/myController');

var app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);
app.use('/users',myController);

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});


let app2 = express();
app2.use(cors());
app2.use(bodyParser.json());
app2.use(bodyParser.urlencoded({extended:false}));

app2.get("/:regNumber", (req,response) => {
  
    MongoClient.connect(mongoUrl, {useUnifiedTopology: true,
        useNewUrlParser: true}, function(err, db) 
        {
           if (err) throw err;
            var dbo = db.db("test");
            
            dbo.collection('vehicles').aggregate([
            {$unwind: { path:"$policies",preserveNullAndEmptyArrays:true}},  
            { $lookup:
              {
                from: 'policies',
                localField: '_id',
                foreignField: 'vehicleId',
                as: 'policydetails'
              }
            },
            {$unwind: { path:"$inpections",preserveNullAndEmptyArrays:true}},
            {
              $lookup:
              {
                from: 'inspections',
                localField: '_id',
                foreignField: 'vehicleId',
                as: 'inspectiondetails'
              }
            },
            {$unwind:{path: "$claims",preserveNullAndEmptyArrays: true}},
            {
              $lookup:
              {
                from: 'claims',
                localField: 'policies',
                foreignField: 'policyId',
                as: 'claimdetails'
              }
            },
            {
              $project: 
              { 
                _id: 1, 
                regNumber:1,  
                inspection_id: "$inspectiondetails._id" ,
                policiesId:  "$policydetails._id",
                claimId:  "$claimdetails._id"
              }
            },
            { $match : { "regNumber" : {'$regex': req.params.regNumber.replace(/\s|-/g, ''), $options: 'i'} } },
              ]).toArray(function(err, result) 
              {
                if (err) throw err;
                response.send(result);
                db.close();
              });
                
        // dbo.collection('vehicles').find({"regNumber":req.params.regNumber}).toArray(function (err,res1){
        //   if (err) throw err;
        //   console.log(res1);
        // });
        })
        //.then(()=> console.log("Mongodb Connected")
        //).catch(err => console.log(err) );
});


// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));

app2.listen(3001, () => {
    console.log("Started server on 3001");   
  });