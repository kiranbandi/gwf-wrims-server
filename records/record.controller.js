const moment = require('moment');
const express = require('express');
const router = express.Router();
const recordService = require('./record.service');
const userService = require('../users/user.service');


// routes
router.get('/all/:username', getRecordByUserName);


module.exports = router;

function getRecordByUserName(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username } = req.user;
    winston.info(username + " -- " + "Request to access records of " + req.params.username);
    recordService.getRecordByUserName(req.params.username)
        .then(records => res.json(records))
        .catch(err => next(err));
}