const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MaterielSchema = new Schema({
    designation: {
        type: String,
        required: true
    },
    serie: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Bon", "Mauvais"]
    },
    etat: {
      type: String,
      enum: ["En stock", "En prêt"]
    },
    category: {
        type: ObjectId,
        ref: 'category'
    },
    img: { data: Buffer, contentType: String },
    filename: { type: String }
}, {timestamps: true});

const MaterielModel = mongoose.model('materiel', MaterielSchema);
module.exports = MaterielModel;