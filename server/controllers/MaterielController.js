const Materiel = require('../models/Materiel');
const Demande = require('../models/Demande');
const History = require('../models/History');
const path = require('path');
const fs = require('fs');

// Find All or One Matériel
exports.find = (req, res) => {
    let id = req.query.id;
    try {
        if (id) {
            Materiel
                .findById(id)
                .populate('category')
                .then(data => {
                    if (!data) {
                        console.log(`Cannot find Materiel with id: ${id}`);
                    } else {
                        res.send(data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            Materiel
                .find()
                .populate('category')
                .then(data => {
                    if (!data) {
                        console.log(`Cannot find Materiel with id: ${id}`);
                    } else {
                        res.send(data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    } catch (e) {
        console.log(e);
    }
}

// Create new Matériel
exports.create = (req, res) => {
    if(req.file === undefined) {
        let materiel = new Materiel({
            designation: req.body.designation,
            status: req.body.status,
            serie: req.body.serie,
            category: req.body.category,
            etat: "En stock",
        });
        // Save matériel in the database
        materiel
            .save(materiel)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({message: err.message});
            })
    } else {
        let materiel = new Materiel({
            designation: req.body.designation,
            status: req.body.status,
            serie: req.body.serie,
            category: req.body.category,
            etat: "En stock",
            filename: req.file.filename,
        });
        // Save matériel in the database
        materiel
            .save(materiel)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({message: err.message});
            })
    }

}

// update a new identified materiel by materiel id
exports.update = async (req, res) => {
    //validate request
    if(!req.body) {
        return res
            .status(400)
            .send({message: "Le champ ne doit pas être vide"});
    }

    const id = req.body.id;
    if(req.file === undefined) {
        Materiel.findByIdAndUpdate(id, req.body)
            .then(data => {
                if(!data){
                    res.status(404).send({message: `Cannot update materiel with ${id}. Maybe materiel not found.`});
                } else {
                    res.send(data);
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({message: 'Error update Employe information.'});
            })
    } else {
        let editMateriel = await Materiel.findByIdAndUpdate(id, { ...req.body, filename: req.file.filename }).exec();
        let source = path.join(__dirname, '../../assets/img/materiel/' + editMateriel.filename);
        fs.unlink(source, (err) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log('files are deleting');
            }
        });
        res.send(editMateriel);
    }
}

// Confirm delete Materiel
exports.confirmDeleteMateriel = async (req, res) => {
    let id = req.body.id;
    const demande = await Demande.find().populate('materiel').exec();
    const materiel = await Materiel.findById(id).exec();
    let response = '';

    try {
        for (let i = 0; i < demande.length; i++) {
            if (demande[i].materiel.designation === materiel.designation) {
                response += 'no-ok';
            }
        }
        res.send({message: response});
    } catch (e) {
        console.log(e);
    }
}

// delete matériel with specified matériel id in the request
exports.delete = (req, res) => {
    const id = req.body.id;
    Materiel.findByIdAndDelete(id, req.body)
        .then(data => {
            if(!data){
                res.status(404).send({message: `Cannot delete materiel with ${id}. Maybe materiel not found.`});
            } else {
                let source = path.join(__dirname, '../../assets/img/materiel/' + data.filename);
                fs.unlink(source, (err) => {
                    if (err) {
                        console.log(err.message);
                    } else {
                        console.log('files are deleting');
                    }
                });
                res.send(data);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({message: 'Error delete materiel information.'});
        })
}

//Returned materiels
exports.returnedMateriel = (req, res) => {
    const id = req.body.idmateriel;
    const iddemande = req.body.iddemande;
    Materiel.findByIdAndUpdate(id, {etat: "En stock"})
        .then(async data => {
            if(!data){
                res.status(404).send({message: `Cannot return materiel with ${id}. Maybe materiel not found.`});
            } else {
                const demande = await Demande.findByIdAndDelete(iddemande).exec();
                console.log(demande);
                res.send(data);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({message: 'Error update Employe information.'});
        })
}
