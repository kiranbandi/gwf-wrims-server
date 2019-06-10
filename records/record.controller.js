const express = require('express');
const router = express.Router();
const recordService = require('./record.service');

// routes
router.post('/flow-data', getRecords);


module.exports = router;

function getRecords(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { modelID, threshold, number, type } = req.body;

    recordService.getRecords(modelID, threshold, number, type)
        .then(records => res.json(records))
        .catch(err => next(err));
}