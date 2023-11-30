const axios = require('axios');
const Category = require('../models/CategoryMateriel');

exports.MaterielIndex = (req, res) => {
    axios.get('http://localhost:8000/api/materiel')
        .then(response => {
            res.render('materiel/MaterielIndex', {title: 'Materiel', materiel: response.data});
        })
        .catch(e => {
            console.log(e);
        })
}

exports.MaterielAdd = (req, res) => {
    axios.get('http://localhost:8000/api/category')
        .then(response => {
            res.render('materiel/MaterielAdd', {title: 'Materiel', categories: response.data});
        })
        .catch(e => {
            console.log(e);
        })
}

exports.MaterielEdit = (req, res) => {
    axios.get('http://localhost:8000/api/materiel', {params: {id: req.query.id}})
        .then(async response => {
            let categorie = await Category.find().exec();
            console.log(categorie);
            res.render('materiel/MaterielEdit', {title: 'Materiel', materiel: response.data, categories: categorie});
        })
        .catch(e => {
            console.log(e);
        })
}

exports.MaterielInUse = (req, res) => {
    axios.get('http://localhost:8000/api/demande')
        .then(response => {
            console.log(response.data)
            res.render('materiel/MaterielInUse', { title: "Materiel en utilisation", materiel: response.data });
        })
        .catch(e => {
            console.log(e);
        })
}