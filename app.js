const express = require('express');
var app = express();
var morgan = require('morgan');
var winston = require('./winston');
const exec = require('child_process').exec;

// Use morgan for logging Requests , combined along with log outputs from winston
app.use(morgan('combined', { stream: winston.stream }));

// Start the server 
app.listen(8443, function() { winston.info("Server Live on Port 8443") })


function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, contents) => {
            if (err) { reject(err) } else { resolve(contents) };
        });
    });
}

app.get('/run-simulation', function(req, res) {
    // Setting response headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Execute the script 
    var script = exec('sh process.sh', (error) => { if (error !== null) { console.log(error) } });

    script.on('close', () => {
        res.end("Simulation run successfully");
    });

});