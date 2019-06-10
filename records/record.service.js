const db = require('../helpers/db');
const Record = db.Record;

module.exports = {
    createMultiple
};


async function createMultiple(recordsList) {
    return await Record.collection.insert(recordsList);
}