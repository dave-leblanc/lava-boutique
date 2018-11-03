const functions = require('firebase-functions');
const imdb = require('imdb-api');
//obtain key from https://www.omdbapi.com/apikey.aspx
const omdb_key = '';

module.exports = {
    search_movie: functions.https.onRequest((req, res) => {
        imdb.get({name: req.body.search}, {apiKey: omdb_key, timeout: 30000})
            .then( resp => {
                console.log(resp);
                res.send(resp);
                return
            })
            .catch( err => {
                console.log(err);
                res.status(500).send(err);
                return
            })
    })

};
