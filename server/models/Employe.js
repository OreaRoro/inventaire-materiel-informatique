const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const EmployeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    fonction: {
        type: ObjectId,
        ref: 'fonction',
        required: true
    }
}, {timestamps: true});

const EmployeModel = mongoose.model('employe', EmployeSchema);
module.exports = EmployeModel;
