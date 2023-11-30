const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check web token exists & verified
    if (token) {
        jwt.verify(token, 'secret token', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

const requireAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'secret token', async (err, decodedToken) => {
            let user = await User.findById(decodedToken.id);
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else if (user.role !== "ADMINISTRATEUR") {
                //res.send({message: "Désolé, vous n'avez pas le droit d'accéder à cette page!"});
                res.redirect('/');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

// Check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'secret token', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser, requireAdmin };