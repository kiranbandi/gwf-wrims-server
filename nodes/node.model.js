const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    number: { type: String, required: true },
    type: { type: String, required: true },
    modelID: { type: String, required: true },
    note: { type: String, required: false },
    link: { type: String, required: false },
    gps: { type: String, required: false }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Node', schema);