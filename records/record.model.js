const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    number: { type: String, required: true },
    timestamp: { type: String, required: true },
    flow: { type: String, required: true },
    type: { type: String, required: true },
    power: { type: String, required: false },
    modelID: { type: String, required: true },
    threshold: { type: String, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Record', schema);