const axios = require('axios');
const Materiel = require('../models/Materiel');
const Employe = require('../models/Employe');

exports.DemandeIndex = (req, res) => {
    axios.get('http://localhost:8000/api/demande')
        .then(async response => {
            const materiel = await Materiel.find().populate('category').exec();
            const employe = await Employe.find().populate('fonction').exec();
            res.render('demande/DemandeIndex', {title: 'Demande', demande: response.data, materiel: materiel, employe: employe});
        })
        .catch(err => {
            console.log(err);
        })
}