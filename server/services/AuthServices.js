//AUTHENTICATION
exports.signup = (req, res) => {
    res.render('authentification/signup') ;
}

exports.login = (req, res) => {
    res.render('authentification/login');
}