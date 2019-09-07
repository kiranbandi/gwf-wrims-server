const db = require('../helpers/db');
const Record = db.Record;

module.exports = {
    getRecords,
    getRecordsForYear
};

async function getRecords(modelID, threshold, number, type, condition) {
    return await Record.find({ modelID, threshold, number, type, condition });
}

async function getRecordsForYear(modelID, threshold, year = '1990', type = 'demand') {
    return await Record.find({ modelID, threshold, type, 'timestamp': { $regex: year, $options: 'i' } });
}