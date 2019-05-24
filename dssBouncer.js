var express = require('express');
const axios = require('axios');
var router = express.Router();

// This file essentially bounces requests from the open python server
// the python server is only available locally so this ensures its not misused or overloaded
// and can only be accessed by logged in members through GWF UI

var pythonServerURL = 'http://localhost:8082';

router.route('/get-catalog')
    .get(function(req, res, next) {
        // validate the ticket against paws
        axios.get(pythonServerURL + '/get-catalog')
            .then((response) => { res.status(200).send(response.data) })
            .catch((err) => {
                res.status(400).json({ message: 'Try again later, python server down' })
            });
    });

router.route('/get-pathdata')
    .post(function(req, res, next) {
        const { a, b, c } = req.body;
        axios.post(pythonServerURL + '/get-pathdata', { a, b, c })
            .then((response) => { res.status(200).send(response.data) })
            .catch((err) => {
                res.status(400).json({ message: 'Try again later, python server down' })
            });
    });

module.exports = router;