const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const functions = require('firebase-functions');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


const GithubWebHook = require('express-github-webhook');
const webhookHandler = GithubWebHook({ path: '/webhook', secret: 'secret' });


app.use(bodyParser.json()); // must use bodyParser in express
app.use(webhookHandler); // use our middleware

// Now could handle following events
webhookHandler.on('*', function (event, repo, data) {
    var db = admin.firestore();
    var collection = db.collection('github-hooks');

    var addDoc = collection.add({
        event: event,
        repo: repo,
        data: data
    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
        res.send(ref.id);
        return
    }, (reason) => {
        res.status(400).send(reason);
        return
    });

});


exports.github_hook = functions.https.onRequest(app);
