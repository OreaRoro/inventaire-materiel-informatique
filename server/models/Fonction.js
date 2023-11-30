const mongoose = require('mongoose');

const FonctionSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    }
}, {timestamps: true});

const FonctionModel = mongoose.model('fonction', FonctionSchema);
module.exports = FonctionModel;