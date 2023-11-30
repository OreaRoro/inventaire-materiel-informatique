const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DemandeSchema = new Schema({
    materiel: {
        type: ObjectId,
        unique: true,
        ref: 'materiel'
    },
    employe: {
        type: ObjectId,
        ref: 'employe'
    },
    etat: {
        type: String,
        enum: ["En attente", "Accepté", "Refusé", "Disponible"]
    },
    dateRetour: {
        type: Date,
        required: true
    }
}, {timestamps: true});

const DemandeModel = mongoose.model('demande', DemandeSchema);
module.exports = DemandeModel;