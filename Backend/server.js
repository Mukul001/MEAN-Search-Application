//jslint esversion : 6

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/test';

const app = express();

app.use(cors());

app.get("/", (req,res) => res.send());

app.get("/:regNumber", (req,response) => {

    let str = req.params.regNumber;
   str = str.replace(/\s|-/g, '').toLowerCase();

    MongoClient.connect(url, {useUnifiedTopology: true,
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
            { $match : { "regNumber" : req.params.regNumber } },
              ]).toArray(function(err, result) 
              {
                if (err) throw err;
                //      result.forEach(element => { 
                //      var str = JSON.stringify(element);
                //      response.send(element); 
                response.send(result);
                db.close();
              });
                
        // dbo.collection('vehicles').find({"regNumber":req.params.regNumber}).toArray(function (err,res1){
        //   if (err) throw err;
        //   console.log(res1);
        // });
        });
    
    
});

app.listen(3000,()=> console.log('Server running on 3000'));