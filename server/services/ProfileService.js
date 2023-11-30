const axios = require('axios');

exports.ProfileIndex = (req, res) => {
    axios.get('http://localhost:8000/api/user', {params: {id: req.query.id}})
        .then(response => {
            res.render('profile/ProfileIndex', {title: 'Profile', users: response.data});
        })
}