const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

//var { User } = require('../models/user.model');
const User = mongoose.model('User');
mongoose.set('useFindAndModify', false);

router.get('/', (req, res) => {
    User.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Users     :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id PUT: ${req.params.id}`);

    var userDetails = {
        fullName: req.body.fullName,
        mobileNo: req.body.mobileNo,
        email: req.body.email,
        password: req.body.password
    };
    User.findByIdAndUpdate(req.params.id, { $set: userDetails }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in User Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id GET : ${req.params.id}`);

    User.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving user :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {
    var userDetails = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        password: req.body.password,
    });
    userDetails.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in user Save :' + JSON.stringify(err, undefined, 2)); }
    });
});


module.exports = router;