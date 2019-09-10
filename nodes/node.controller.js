const express = require('express');
const router = express.Router();
const nodeService = require('./node.service');

// routes
router.post('/get-nodes', getNodes);
router.post('/register-node', registerNode);
router.post('/update-node', updateNode);
router.post('/delete-node', deleteNode);


module.exports = router;

function getNodes(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { modelID } = req.body;

    nodeService.getNodes(modelID)
        .then(nodes => res.json(nodes))
        .catch(err => next(err));
}


function registerNode(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { modelID, number, type, note, latitude, longitude, link = '' } = req.body;

    nodeService.create({ modelID, number, latitude, longitude, type, note, link })
        .then((data) => res.json({ data }))
        .catch(err => next(err));
}

function updateNode(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { modelID, number, type, latitude, longitude, note, link = '' } = req.body;

    nodeService.update({ modelID, number, latitude, longitude, type, note, link })
        .then((data) => res.json({ data }))
        .catch(err => next(err));
}

function deleteNode(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { modelID, number } = req.body;

    nodeService.deleteNode(modelID, number)
        .then(() => res.json({}))
        .catch(err => next(err));
}