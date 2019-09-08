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
    .then((data) => createMultiple(parseDemand(data, model, 'base', 'base')))
    .then((data) => fs.readFileAsync(rootPath + 'demand_five_increase.csv'))
    .then((data) => createMultiple(parseDemand(data, model, 'five', 'increase')))
    .then((data) => fs.readFileAsync(rootPath + 'demand_ten_increase.csv'))
    .then((data) => createMultiple(parseDemand(data, model, 'ten', 'increase')))
    .then((data) => fs.readFileAsync(rootPath + 'demand_five_decrease.csv'))
    .then((data) => createMultiple(parseDemand(data, model, 'five', 'decrease')))
    .then((data) => fs.readFileAsync(rootPath + 'demand_ten_decrease.csv'))
    .then((data) => createMultiple(parseDemand(data, model, 'ten', 'decrease')))
    // start parsing and storing inflow 
    .then((data) => fs.readFileAsync(rootPath + 'inflow_base.csv'))
    .then((data) => createMultiple(parseInflow(data, model, 'base', 'base')))
    .then((data) => fs.readFileAsync(rootPath + 'inflow_five_increase.csv'))
    .then((data) => createMultiple(parseInflow(data, model, 'five', 'increase')))
    .then((data) => fs.readFileAsync(rootPath + 'inflow_ten_increase.csv'))
    .then((data) => createMultiple(parseInflow(data, model, 'ten', 'increase')))
    .then((data) => fs.readFileAsync(rootPath + 'inflow_five_decrease.csv'))
    .then((data) => createMultiple(parseInflow(data, model, 'five', 'decrease')))
    .then((data) => fs.readFileAsync(rootPath + 'inflow_ten_decrease.csv'))
    .then((data) => createMultiple(parseInflow(data, model, 'ten', 'decrease')))
    // start parsing and storing links
    .then((data) => fs.readFileAsync(rootPath + 'links_base.csv'))
    .then((data) => createMultiple(parseLinks(data, model, 'base', 'base')))
    .then((data) => fs.readFileAsync(rootPath + 'links_five_increase.csv'))
    .then((data) => createMultiple(parseLinks(data, model, 'five', 'increase')))
    .then((data) => fs.readFileAsync(rootPath + 'links_ten_increase.csv'))
    .then((data) => createMultiple(parseLinks(data, model, 'ten', 'increase')))
    .then((data) => fs.readFileAsync(rootPath + 'links_five_decrease.csv'))
    .then((data) => createMultiple(parseLinks(data, model, 'five', 'decrease')))
    .then((data) => fs.readFileAsync(rootPath + 'links_ten_decrease.csv'))
    .then((data) => createMultiple(parseLinks(data, model, 'ten', 'decrease')))
    // start parsing and storing reservoir info
    .then((data) => fs.readFileAsync(rootPath + 'reservoir_base.csv'))
    .then((data) => createMultiple(parseReservoir(data, model, 'base', 'base')))
    .then((data) => fs.readFileAsync(rootPath + 'reservoir_five_increase.csv'))
    .then((data) => createMultiple(parseReservoir(data, model, 'five', 'increase')))
    .then((data) => fs.readFileAsync(rootPath + 'reservoir_ten_increase.csv'))
    .then((data) => createMultiple(parseReservoir(data, model, 'ten', 'increase')))
    .then((data) => fs.readFileAsync(rootPath + 'reservoir_five_decrease.csv'))
    .then((data) => createMultiple(parseReservoir(data, model, 'five', 'decrease')))
    .then((data) => fs.readFileAsync(rootPath + 'reservoir_ten_decrease.csv'))
    .then((data) => createMultiple(parseReservoir(data, model, 'ten', 'decrease')))
    .then((data) => {
        console.log("all records ingested without any errors for model -", model);
    })
    .catch((error) => {
        console.log(error);
    })


function parseDemand(data, modelID, threshold, condition) {
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
            modelID,
            threshold: threshold + '-' + condition
        });
    }
    return chunkWeeksIntoMonths(tempStore);
}

function parseInflow(data, modelID, threshold, condition) {
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
            modelID,
            threshold: threshold + '-' + condition
        });
    }
    return chunkWeeksIntoMonths(tempStore);
}

function parseReservoir(data, modelID, threshold, condition) {
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
            modelID,
            threshold: threshold + '-' + condition
        });
    }
    return chunkWeeksIntoMonths(tempStore, true);
}

function parseLinks(data, modelID, threshold, condition) {
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
            modelID,
            threshold: threshold + '-' + condition
        });
    }
    return chunkWeeksIntoMonths(tempStore);
}

function chunkWeeksIntoMonths(data, isPowerPresent = false) {

    var tempStore = [];

    var groupedByNumber = _.groupBy(data, (d) => d.number);

    _.map(groupedByNumber, (records) => {

        let currentMonth = '01',
            accumulator = 0,
            timestamp = records[0].timestamp,
            number = records[0].number,
            modelID = records[0].modelID,
            threshold = records[0].threshold,
            type = records[0].type,
            count = 0,
            powerAccumulator = 0;
        _.map(records, (record) => {
            month = record.timestamp.split("/")[0];
            if (month == currentMonth) {
                accumulator += roundToNDecimals(record.flow);
                if (isPowerPresent) { powerAccumulator += roundToNDecimals(record.power) };
                count += 1;
            } else {
                if (isPowerPresent) {
                    tempStore.push({ number, modelID, threshold, type, timestamp, power: roundToNDecimals(powerAccumulator / count), flow: roundToNDecimals(accumulator / count) })
                } else {
                    tempStore.push({ number, modelID, threshold, type, timestamp, flow: roundToNDecimals(accumulator / count) })
                }
                // reset timestamp and accumulator and count
                accumulator = roundToNDecimals(record.flow);
                if (isPowerPresent) { powerAccumulator = roundToNDecimals(record.power) };
                count = 1;
                currentMonth = month;
                timestamp = record.timestamp;
            }
        });
    });

    return tempStore;

}

function roundToNDecimals(value, decimals = 2) {
    let rounder = 1;
    for (let i = 1; i <= decimals; i++) {
        rounder *= 10;
    }
    return Math.round(Number(value) * rounder) / rounder
}