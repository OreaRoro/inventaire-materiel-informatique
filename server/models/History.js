const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const HistorySchema = new Schema({
    materiel: {
        type: ObjectId,
        ref: 'materiel',
    },
    employe: {
        type: ObjectId,
        ref: 'employe'
    },
    utilisateur: {
        type: ObjectId,
        ref: 'user'
    },
    action: {
        type: String,
        enum: ["Accepté", "Refusé", "En attente", "Supprimé", "Retourné"]
    }
}, {timestamps: true});

const HistoryModel = mongoose.model('history', HistorySchema);
module.exports = HistoryModel;