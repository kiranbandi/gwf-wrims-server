const express = require('express');
const router = express.Router();
const recordService = require('./record.service');

// routes
router.post('/flow-data', getRecords);
router.post('/yearly-flow-data', getRecordsForYear);


module.exports = router;

function getRecords(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { modelID, threshold, number, condition, type } = req.body;

    recordService.getRecords(modelID, threshold, condition, number, type)
        .then(records => res.json(records))
        .catch(err => next(err));
}


function getRecordsForYear(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { modelID, threshold, year } = req.body;

    recordService.getRecordsForYear(modelID, threshold, year)
        .then(records => res.json(records))
        .catch(err => next(err));
}