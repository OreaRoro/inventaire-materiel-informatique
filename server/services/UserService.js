const axios = require('axios');

exports.UserIndex = (req, res) => {
    axios.get('http://localhost:8000/api/user')
        .then(response => {
            res.render('users/UserIndex', {title: "Users", users: response.data});
        })
        .catch(e => {
            console.log(e.message);
        })
}

exports.UserAdd = (req, res) => {
    res.render('users/UserAdd', {title: "Users"});
}

exports.UserUpdate = (req, res) => {
    axios.get('http://localhost:8000/api/user', {params: {id: req.query.id}})
        .then(response => {
            res.render('users/UserUpdate', {title: "Users", users: response.data});
        })
        .catch(e => {
            console.log(e.message);
        })
}