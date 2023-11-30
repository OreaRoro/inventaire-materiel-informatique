const MaterielModel = require("../models/Materiel");
const EmployeModel = require("../models/Employe");
const User = require('../models/User');

exports.dataChart = async (req, res) => {
    const materiels = [];
    const employes= [];
    const user = [];
    let date = req.body.date;

    for (let i = 1; i < 13; i++) {
        materiels.push(await MaterielModel.find({
            $and: [
                {"$expr": {"$eq": [{"$month": "$createdAt"}, i]}},
                {createdAt: {$gte: new Date(`${date}-01-01T12:00:00Z`)}},
                {createdAt: {$lte: new Date(`${date}-12-31T12:00:00Z`)}}
            ]
        })
            .count()
            .exec());
    }

    for (let j = 1; j < 13; j++) {
        employes.push(await EmployeModel.find({
            $and: [
                {"$expr": {"$eq": [{"$month": "$createdAt"}, j]}},
                {createdAt: {$gte: new Date(`${date}-01-01T12:00:00Z`)}},
                {createdAt: {$lte: new Date(`${date}-12-31T12:00:00Z`)}}
            ]
        })
            .count()
            .exec());
    }

    for (let j = 1; j < 13; j++) {
        user.push(await User.find({
            $and: [
                {"$expr": {"$eq": [{"$month": "$createdAt"}, j]}},
                {createdAt: {$gte: new Date(`${date}-01-01T12:00:00Z`)}},
                {createdAt: {$lte: new Date(`${date}-12-31T12:00:00Z`)}}
            ]
        })
            .count()
            .exec());
    }

    res.send({materiel: materiels, employe: employes, users: user});
}