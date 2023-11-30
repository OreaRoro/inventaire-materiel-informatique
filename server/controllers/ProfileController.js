const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const ProfilehandleErrors = (err) => {
    let error = {email: '', password: ''};
    //Duplicate error code
    if(err.code === 11000) {
        error.email = "Cet email est déjà utilisé";
    }
    //Validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            error[properties.path] = properties.message;
        })
    }
    return error;
}

exports.update = async (req, res) => {
    try{
        const id = req.body.id;
        if(req.file === undefined) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt();
                const password = req.body.password;
                const passwordhash = await bcrypt.hash(password, salt);
                await User
                    .findByIdAndUpdate(id, {password:passwordhash})
                    .then(data => {
                        res.send(data);
                    })
                    .catch(err => {
                        const error = ProfilehandleErrors(err);
                        res.status(400).json({error});
                        console.log(err.message);
                    })
            }  else {
                await User
                    .findByIdAndUpdate(id, req.body)
                    .then(data => {
                        res.send(data);
                    })
                    .catch(err => {
                        const error = ProfilehandleErrors(err);
                        res.status(400).json({error});
                        console.log(err.message);
                    })
            }

        } else {
            await User
                .findByIdAndUpdate(id, {...req.body, filename: req.file.filename})
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
                    const error = ProfilehandleErrors(err);
                    res.status(400).json({error});
                    console.log(err.message);
                })
        }

    } catch (e) {
        console.log(e);
    }
}