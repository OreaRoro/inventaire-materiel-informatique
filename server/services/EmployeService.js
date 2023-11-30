const axios = require('axios');
const Fonction = require('../models/Fonction');

exports.EmployeIndex = (req, res) => {
    axios.get('http://localhost:8000/api/employe')
        .then(response => {
            res.render('employe/EmployeIndex', {title: "Employe", employe: response.data});
        })
        .catch(err => {
            console.log(err);
        })
}

exports.EmployeAdd = (req, res) => {
    axios.get('http://localhost:8000/api/fonction')
        .then(response => {
            res.render('employe/EmployeAdd', {title: "Employe", fonction: response.data});
        })
        .catch(err => {
            console.log(err);
        })
}

exports.EmployeUpdate = (req, res) => {
    axios.get('http://localhost:8000/api/employe', {params: {id: req.query.id}})
        .then(async response => {
            let fonction = await Fonction.find().exec();
            res.render('employe/EmployeEdit', {title: 'Employe', employe: response.data ,fonction: fonction});
        })
        .catch(e => {
            console.log(e);
        })
}