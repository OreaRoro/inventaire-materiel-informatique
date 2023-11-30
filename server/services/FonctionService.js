const axios = require('axios');

exports.FonctionIndex = (req, res) => {
    axios.get('http://localhost:8000/api/fonction')
        .then(response => {
            res.render('fonction/fonctionIndex', {title: 'Fonction', fonction: response.data});
        })
        .catch(err => {
            console.log(err);
        })
}