const Demande = require('../models/Demande');
const Materiel = require('../models/Materiel');
const History = require('../models/History');

const DemandehandleErrors = (err) => {
    let errors = {idmateriel: ''};

    //Duplicate error code
    if(err.code === 11000) {
        errors.idmateriel = "Ce matériel est déjà en cours de démande.";
    }

    return errors;
}

// Find One or All Demande
exports.find = (req, res) => {
    let id = req.query.id;
    try {
        if (id) {
            Demande
                .findById(id)
                .populate({
                    path: 'materiel',
                    populate: {
                        path: 'category'
                    }
                })
                .populate('employe')
                .then(data => {
                    if (!data) {
                        console.log(`Cannot find demande with id: ${id}.`);
                    } else {
                        res.send(data);
                    }
                })
        } else {
            Demande
                .find()
                .populate({
                    path: 'materiel',
                    populate: {
                        path: 'category'
                    }
                })
                .populate('employe')
                .then(data => {
                    if (!data) {
                        console.log(`Cannot find demande with id: ${id}.`);
                    } else {
                        res.send(data);
                    }
                })
        }
    } catch (e) {
        console.log(e);
    }
}

//Create new demande
exports.create = (req, res) => {
    //Validate request
    if(!req.body) {
        res.status(500).send({message: "Les champs ne doivent pas être vide!!!"});
    }
    const demande = new Demande({
        materiel: req.body.materiel,
        employe: req.body.employe,
        dateRetour: req.body.dateRetour,
        etat: req.body.etat
    });
    //Save demande in database
    demande
        .save(demande)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            let error = DemandehandleErrors(err);
            res.status(400).json({error});
        })
};

exports.accept = (req, res) => {
    const id_demande = req.body.iddemande;
    const id_materiel = req.body.idmateriel;
    Demande.findByIdAndUpdate(id_demande, {etat: "Accepté"}, {new: true})
        .then(async data => {
            if(!data){
                res.status(404).send({message: `Cannot accept demande with ${id_demande}. Maybe demande not found.`});
            } else {
                await Materiel.findByIdAndUpdate(id_materiel, {etat: "En prêt"}).exec();
                res.send(data);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({message: err.message});
        })
};

exports.cancel = (req, res) => {
    const id_demande = req.body.iddemande;
    const id_materiel = req.body.idmateriel;
    Demande.findByIdAndUpdate(id_demande, {etat: "Refusé"}, {new: true})
        .then(async data => {
            if(!data){
                res.status(404).send({message: `Cannot canceled demande with ${id_demande}. Maybe demande not found.`});
            } else {
                await Materiel.findByIdAndUpdate(id_materiel, {etat: "En stock"}).exec();
                res.send(data);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({message: err.message});
        })
};

exports.pending = (req, res) => {
    const id_demande = req.body.iddemande;
    const id_materiel = req.body.idmateriel;
    Demande.findByIdAndUpdate(id_demande, {etat: "En attente"}, {new: true})
        .then(async data => {
            if(!data){
                res.status(404).send({message: `Cannot pending demande with ${id_demande}. Maybe demande not found.`});
            } else {
                await Materiel.findByIdAndUpdate(id_materiel, {etat: "En stock"}).exec();
                res.send(data);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({message: err.message});
        })
};

exports.delete = (req, res) => {
    const id_demande = req.body.iddemande;
    const id_materiel = req.body.idmateriel;
    Demande.findByIdAndDelete(id_demande)
        .then(async data => {
            if(!data){
                res.status(404).send({message: `Cannot delete demande with ${id_demande}. Maybe demande not found.`});
            } else {
                await Materiel.findByIdAndUpdate(id_materiel, {etat: "En stock"}).exec();
                res.send(data);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({message: err.message});
        })
}