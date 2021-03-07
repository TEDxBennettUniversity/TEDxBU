const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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
        enum: ['Basic Pass', 'Early Bird', 'Premium Pass']
    },
    paid: {
        type: Boolean,
        default: false
    },
    paymentID: {
        type: String,
        default: 'NULL'
    },
    orderID: {
        type: String,
        default: 'NULL'
    }
});

module.exports = mongoose.model('Detail', DetailsSchema);