const db = require('./helpers/db');
const _ = require('lodash');
const Record = db.Record;
var fs = require('fs');

timeseries = [];

async function createMultiple(recordsList) {
    return await Record.collection.insert(recordsList);
}

const model = 'highwood';
const rootPath = 'modsim-data/' + model + '/';

// make promise version of fs.readFile()
fs.readFileAsync = function(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, { encoding: 'utf8' }, function(err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};

fs.readFileAsync(rootPath + 'timesteps.csv')
    // read time series then start parsing and storing demand  
    .then((data) => {
        timeseries = _.map(data.split("\n").slice(1, data.split("\n").length - 1), (d) => d.split(",")[1].split(" ")[0]);
        return fs.readFileAsync(rootPath + 'demand_base.csv');
    })
    .then((data) => createMultiple(parseDemand(data, model, 'base')))
    .then((data) => fs.readFileAsync(rootPath + 'demand_five.csv'))
    .then((data) => createMultiple(parseDemand(data, model, 'five')))
    .then((data) => fs.readFileAsync(rootPath + 'demand_ten.csv'))
    .then((data) => createMultiple(parseDemand(data, model, 'ten')))
    // start parsing and storing inflow 
    .then((data) => fs.readFileAsync(rootPath + 'inflow_base.csv'))
    .then((data) => createMultiple(parseInflow(data, model, 'base')))
    .then((data) => fs.readFileAsync(rootPath + 'inflow_five.csv'))
    .then((data) => createMultiple(parseInflow(data, model, 'five')))
    .then((data) => fs.readFileAsync(rootPath + 'inflow_ten.csv'))
    .then((data) => createMultiple(parseInflow(data, model, 'ten')))
    // start parsing and storing links
    .then((data) => fs.readFileAsync(rootPath + 'links_base.csv'))
    .then((data) => createMultiple(parseLinks(data, model, 'base')))
    .then((data) => fs.readFileAsync(rootPath + 'links_five.csv'))
    .then((data) => createMultiple(parseLinks(data, model, 'five')))
    .then((data) => fs.readFileAsync(rootPath + 'links_ten.csv'))
    .then((data) => createMultiple(parseLinks(data, model, 'ten')))
    // start parsing and storing reservoir info
    .then((data) => fs.readFileAsync(rootPath + 'reservoir_base.csv'))
    .then((data) => createMultiple(parseReservoir(data, model, 'base')))
    .then((data) => fs.readFileAsync(rootPath + 'reservoir_five.csv'))
    .then((data) => createMultiple(parseReservoir(data, model, 'base')))
    .then((data) => fs.readFileAsync(rootPath + 'reservoir_ten.csv'))
    .then((data) => createMultiple(parseReservoir(data, model, 'base')))
    .then((data) => {
        console.log("all records ingested without any errors for model -", model);
    })
    .catch((error) => {
        console.log(error);
    })


function parseDemand(data, modelID, threshold) {
    var dataStore = data.split("\n"),
        line,
        tempStore = [];
    for (lineIndex = 1; lineIndex < dataStore.length - 1; lineIndex++) {
        line = dataStore[lineIndex].split(",");
        tempStore.push({
            'number': line[0],
            'timestamp': timeseries[line[1]],
            'flow': line[2],
            'type': 'demand',
            'modelID': modelID,
            'threshold': threshold
        });
    }
    return tempStore;
}

function parseInflow(data, modelID, threshold) {
    var dataStore = data.split("\n"),
        line,
        tempStore = [];
    for (lineIndex = 1; lineIndex < dataStore.length - 1; lineIndex++) {
        line = dataStore[lineIndex].split(",");
        tempStore.push({
            'number': line[0],
            'timestamp': timeseries[line[1]],
            'flow': line[2],
            'type': 'inflow',
            'modelID': modelID,
            'threshold': threshold
        });
    }
    return tempStore;
}

function parseReservoir(data, modelID, threshold) {
    var dataStore = data.split("\n"),
        line,
        tempStore = [];
    for (lineIndex = 1; lineIndex < dataStore.length - 1; lineIndex++) {
        line = dataStore[lineIndex].split(",");
        tempStore.push({
            'number': line[0],
            'timestamp': timeseries[line[1]],
            // we are taking downstream flow PUMP_OUT
            'flow': line[9],
            // average power
            'power': line[12],
            'type': 'reservoir',
            'modelID': modelID,
            'threshold': threshold
        });
    }
    return tempStore;
}

function parseLinks(data, modelID, threshold) {
    var dataStore = data.split("\n"),
        line,
        tempStore = [];
    for (lineIndex = 1; lineIndex < dataStore.length - 1; lineIndex++) {
        line = dataStore[lineIndex].split(",");
        tempStore.push({
            'number': line[0],
            'timestamp': timeseries[line[1]],
            'flow': line[2],
            'type': 'link',
            'modelID': modelID,
            'threshold': threshold
        });
    }
    return tempStore;
}