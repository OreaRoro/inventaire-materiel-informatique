const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const UserhandleErrors = (err) => {
    let errors = {email: '', password: ''};

    //Duplicate error code
    if(err.code === 11000) {
        errors.email = "Cet email est déjà utilisé";
    }

    //Validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

// Find All or One User
exports.find = (req, res) => {
    let id = req.query.id;
    try {
        if (id) {
            User
                .findById(id)
                .then(data => {
                    if(!data) {
                        console.log(`Cannot find User with id: ${id}, maybe user not found`);
                        res.send({message: `Auccun utilisateur trouvé.`});
                    } else {
                        res.send(data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            User
                .find()
                .then(data => {
                    if (!data) {
                        res.send({message: `Auccun utilisateur trouvé.`});
                    } else {
                        res.send(data);
                    }
                })
                .catch(err => {
                    res.send({message: err.message});
                })
        }
    } catch (e) {
        console.log(e.message);
    }
}

// Create new User
exports.create = (req, res) => {
    try {
        const {email, name, lastname, password} = req.body;
        const user = new User({
            email: email,
            name: name,
            lastname: lastname,
            password: password,
            role: "UTILISATEUR"
        });
        user
            .save(user)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                const errors = UserhandleErrors(err);
                res.status(400).json({errors});
                console.log(err.message);
            })
    } catch (e) {
        console.log(e);
    }
}

// Update User by id
exports.update = (req, res) => {
    try {
        const id = req.body.id;
       User
           .findByIdAndUpdate(id, req.body)
           .then(data => {
               res.send(data);
           })
           .catch(err => {
               const errors = UserhandleErrors(err);
               res.status(400).json({errors});
               //console.log(err.message);
           })
    } catch (e) {
        console.log(e);
    }
}

// Delete User by id
exports.delete = async (req, res) => {
    const id = req.body.id;
    try{
        await User
            .findByIdAndDelete(id)
            .then(data => {
                let source = path.join(__dirname, '../../assets/img/avatars/' + data.filename);
                fs.unlink(source, (err) => {
                    if (err) {
                        console.log(err.message);
                    } else {
                        console.log('files are deleting');
                    }
                });
                res.send(data);
            })
            .catch(err => {
                console.log(err.message);
            })
    } catch (e) {
        console.log(e.message);
    }
}