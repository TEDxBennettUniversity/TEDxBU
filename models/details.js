const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    awareness: {
        type: String,
        required: true
    },
    tier: {
        type: String,
        required: true,
        enum: ['Basic Pass', 'Early Bird', 'Discounted Pass']
    },
    orderID: {
        type: String,
    }
});

module.exports = mongoose.model('Detail', DetailsSchema);