var express = require('express');
var router = express.Router();
const exec = require('child_process').exec;

router.route('/run-simulation')
    .get((req, res) => {
        // Execute the script 
        var script = exec('sh process.sh', (error) => { if (error !== null) { console.log(error) } });
        script.on('close', () => {
            res.end("Simulation run successfully");
        });
    });
module.exports = router;