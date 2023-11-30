const Userdata = require('../models/User');
const jwt = require('jsonwebtoken');

//AUTHENTICATION
const handleErrors = (err) => {
    let errors = {email: '', name: '', password: ''};

    //Duplicate error code
    if(err.code === 11000) {
        errors.email = "Cet email est déjà utilisé";
    }

    //Validation errors
    if(err.message.includes('users validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

// JWT
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'secret token', { expiresIn: maxAge })
}

exports.signup = async (req, res) => {
    const {name, email, password, lastname, role} = req.body;
    try {
        const user = await Userdata.create({name,lastname, email, password, role});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Userdata.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = err.message
        res.status(400).json({ errors });
    }
}

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
}