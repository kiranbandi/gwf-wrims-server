const db = require('../helpers/db');
const Record = db.Record;

module.exports = {
    getRecords
};

async function getRecords(modelID, threshold, number, type) {
    return await Record.find({ modelID, threshold, number, type });
}