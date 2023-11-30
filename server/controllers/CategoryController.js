const Category = require('../models/CategoryMateriel');
const Materiel = require('../models/Materiel');

const CategoryhandleErrors = (err) => {
    let errors = {title: ''};

    //Duplicate error code
    if(err.code === 11000) {
        errors.title = "Cette catégorie est déjà inscrit dans votre liste de catégorie.";
    }

    return errors;
}

// Find All or One Category
exports.find = (req, res) => {
    let id = req.query.id;
    try {
        if (id) {
            Category
                .findById(id)
                .then(data => {
                    if (!data) {
                        console.log(`Cannot find Category with id: ${id}`);
                    } else {
                        res.send(data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            Category
                .find()
                .then(data => {
                    if (!data) {
                        console.log(`Cannot find Category with id: ${id}`);
                    } else {
                        res.send(data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    } catch (e) {
        console.log(e)
    }
}

// Create a new Category
exports.create = (req, res) => {
    const { title } = req.body;
    try {
        const category = new Category({ title: title });
        category
            .save(category)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                const error = CategoryhandleErrors(err);
                res.send({error});
                console.log(err);
            })
    } catch (e) {
        console.log(e);
    }
}

// Update Category
exports.update = (req, res) => {
    let id = req.body.id;
    try {
        Category
            .findByIdAndUpdate(id, req.body)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                const error = CategoryhandleErrors(err);
                res.send({error});
                console.log(err);
            })
    } catch (e) {
        console.log(e);
    }
}

// Confirm delete Category
exports.confirmDeleteCategory = async (req, res) => {
    let id = req.body.id;
    const materiel = await Materiel.find().populate('category').exec();
    const category = await Category.findById(id).exec();
    let response = '';

    try {
        for (let i = 0; i < materiel.length; i++) {
            if (materiel[i].category.title === category.title) {
                response += 'no-ok';
            }
        }
        res.send({message: response});
    } catch (e) {
        console.log(e);
    }
}

// Delete Category
exports.delete = (req, res) => {
    let id = req.body.id;
    try {
        Category
            .findByIdAndDelete(id)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                console.log(err);
            })
    } catch (e) {
        console.log(e);
    }
}