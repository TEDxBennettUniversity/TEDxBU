const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    ip: String,
    date: String
});

module.exports = mongoose.model('Address', AddressSchema);