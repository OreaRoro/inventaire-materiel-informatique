const MaterielModel = require("../models/Materiel");
const EmployeModel = require('../models/Employe');
const Users = require('../models/User');
const { faker } = require('@faker-js/faker');

// HOME
exports.home = async (req, res) => {
    const CountEmploye = await EmployeModel.find().count().exec();
    const CountMateriel = await MaterielModel.find().count().exec();
    const CountUser = await Users.find().count().exec();
    const materiel = [];
    const employe= [];
    const user = [];
    for (let i = 1; i < 13; i++) {
        materiel.push(await MaterielModel.find({"$expr": {"$eq": [{"$month": "$createdAt"}, i]}}).count().exec());
    }

    for (let j = 1; j < 13; j++) {
        employe.push(await EmployeModel.find({"$expr": {"$eq": [{"$month": "$createdAt"}, j]}}).count().exec());
    }

    for (let k = 1; k < 13; k++) {
        user.push(await Users.find({"$expr": {"$eq": [{"$month": "$createdAt"}, k]}}).count().exec());
    }
    res.render('index', {title: "Dashboard",CountUser:CountUser, compteurEmploye: CountEmploye, compteurMateriel: CountMateriel, materiel: materiel, employe: employe, users: user });
}