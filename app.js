const express = require('express');
var morgan = require('morgan');
var winston = require('./helpers/winston');
const bodyParser = require('body-parser');
const errorHandler = require('./helpers/errorHandler');
var jwt = require('./helpers/jwt');

// Initialise the express app
var app = express();

// Use morgan for logging Requests , combined along with log outputs from winston
app.use(morgan('combined', { stream: winston.stream }));

// Setting response headers to be used for all API endpoints
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, authorization');
    next();
});

// Start the server 
app.listen(8081, function() { winston.info("Server Live on Port 8081") })

// Attach data from API call to request object body
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

// use JWT auth to secure the api
app.use(jwt());

// api route for authentication
app.use('/api/auth', require('./authenticate'))

//  api route for simulation model - no longer in use
// app.use('/api/model', require('./simulation'))

//  api route for simulation model - no longer in use
// app.use('/api/dss', require('./dssBouncer'))

//  api route for MODSIM data 
app.use('/api/records', require('./records/record.controller'));
//  api route for Custom Map Nodes
app.use('/api/nodes', require('./nodes/node.controller'));

// global error handler
app.use(errorHandler);