const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CategoyMaterielSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    }
}, {timestamps: true});

const CategoyMaterielModel = mongoose.model('category', CategoyMaterielSchema);
module.exports = CategoyMaterielModel;