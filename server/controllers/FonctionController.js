const Fonction = require('../models/Fonction');
const Employe = require('../models/Employe');

const FonctionhandleErrors = (err) => {
    let errors = {title: ''};

    //Duplicate error code
    if(err.code === 11000) {
        errors.title = "Ce fonction est déjà inscrit dans votre liste de fonction.";
    }

    return errors;
}

// Find All or One Fonction
exports.find = (req, res) => {
    let id = req.query.id;
    try {
        if (id) {
            Fonction
                .findById(id)
                .then(data => {
                    if (!data) {
                        console.log(`Fonction not found with id: ${id}, maybe fonction not found!`);
                    } else {
                        res.status(201).send(data);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            Fonction
                .find()
                .then(data => {
                    if (!data) {
                        console.log(`Fonction not found with id: ${id}, maybe fonction not found!`);
                    } else {
                        res.status(201).send(data);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    } catch (e) {
        console.log(e)
    }
}

// Create a new Fonction
exports.create = (req, res) => {
    try{
        let fonction = new Fonction({title: req.body.title});
        fonction
            .save(fonction)
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                let error = FonctionhandleErrors(err);
                res.status(400).json({error});
            });
    } catch (e) {
        console.log(e);
    }
}

// Update Fonction
exports.update = (req, res) => {
    let id = req.body.id;
    try {
        Fonction
            .findByIdAndUpdate(id, req.body)
            .then(data => {
                if (!data) {
                    console.log(`cannot update Fonction with id: ${id}.`);
                } else {
                    res.status(201).send(data);
                }
            })
            .catch(err => {
                let error = FonctionhandleErrors(err);
                res.status(400).json({error});
            })
    } catch (e) {
        console.log(e);
    }
}

// Confirm delete fonction
exports.confirmDelete = async (req, res) => {

    let id = req.body.id;
    let employe = await Employe.find().populate('fonction').exec();
    let employeCount = await Employe.find().count().exec();
    let fonction = await Fonction.findById(id).exec();
    let response = '';

   try {
       for (let i = 0; i < employe.length; i++) {
           if (employe[i].fonction.title === fonction.title) {
               response += 'no-ok'
           }
       }
       res.send({message: response});
   } catch (e) {
       console.log(e);
   }

}

// Delete Fonction
exports.delete = async (req, res) => {
    let id = req.body.id;
    try {
        Fonction
            .findByIdAndDelete(id)
            .then(data => {
                if (!data) {
                    console.log(`Cannot delete fonction with id: ${id}`);
                } else {
                    res.status(200).send(data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    } catch (e) {
        console.log(e);
    }
}