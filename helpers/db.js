const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gwf');
mongoose.Promise = global.Promise;

module.exports = {
    Record: require('../records/record.model'),
};