const axios = require('axios');

exports.HistoryIndex = (req, res) => {
    axios.get('http://localhost:8000/api/history')
        .then(response => {
            res.render('history/HistoryIndex', {title: "Historique", history: response.data});
        })
        .catch(err => {
            console.log(err);
        })
}

exports.Retour = (req, res) => {
    axios.get('http://localhost:8000/api/history')
        .then(response => {
            res.render('history/Retour', {title: "Retour", history: response.data});
        })
        .catch(err => {
            console.log(err);
        })
}