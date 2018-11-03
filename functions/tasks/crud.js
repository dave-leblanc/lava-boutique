const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = {
    create: functions.https.onRequest((req, res) => {
        var db = admin.firestore();
        var collection = db.collection('todo-list');
        var data = req.body;

        var list = {
            name: data.Name,
            description: data.Desc
        }
        if (data.hasOwnProperty("Items")){
            list.Items=data.items
        }
        var addDoc = collection.add(list).then(ref => {
            console.log('Added document with ID: ', ref.id);
            res.send(ref.id);
            return
        }, (reason) => {
            res.status(400).send(reason);
            return
        });

    }),

    read: functions.https.onRequest((req, res) => {
        var db = admin.firestore();
        var collection = db.collection('todo-list');

        var todoId = req.query.id;

        var toDoRef = collection.doc(todoId );
        var getDoc = toDoRef.get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                    res.status(404).send('No such document!');
                    return
                } else {
                    console.log('Document data:', doc.data());
                    res.send(doc.data());
                    return
                }

            })
            .catch(err => {
                console.log('Error getting document', err);
                res.status(500).send(getDoc);
                return
            });
    }),

    update: functions.https.onRequest((req, res) => {
        var db = admin.firestore();
        var collection = db.collection('todo-list');
        var data = req.body;

        var todoId = req.query.id;

        var toDoRef = collection.doc(todoId );
        var getDoc = toDoRef.get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                    res.status(404).send('No such document!');
                    return
                } else {
                    console.log('Document data:', doc.data());
                    console.log(data.hasOwnProperty("Name"));
                    if (data.hasOwnProperty("Name")) {
                        toDoRef.set({
                            name: data.Name,
                            postProcessed: false
                        }, {merge: true}).then(result => {
                            console.log(result);
                            return
                        }).catch(err => {
                            console.log('Error getting document', err);
                            res.status(500).send(err);
                            return
                        });
                    }

                    if (data.hasOwnProperty("Desc")) {
                        toDoRef.set({
                            desc: data.Desc,
                            postProcessed: false
                        }, {merge: true}).then(result => {
                            console.log(result);
                            return
                        }).catch(err => {
                            console.log('Error getting document', err);
                            res.status(500).send(err);
                            return
                        });
                    }


                    if (data.hasOwnProperty("Items")) {
                        for (var n in data.Items) {
                            toDoRef.collection('Items')
                                .add({item: data.Items[n]}).then(result => {
                                    console.log(result);
                                    return
                                }).catch(err => {
                                    console.log('Error getting document', err);
                                    res.status(500).send(err);
                                    return
                                });
                        }
                    }

                    res.send("Updated All Successfully")
                    return

                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                res.status(500).send(getDoc);
            });

        //res.send("Update Funciton!");
    }),

    delete: functions.https.onRequest((req, res) => {
        var db = admin.firestore();
        var collection = db.collection('todo-list');

        var todoId = req.query.id;
        var path = 'todo-list/'+todoId
        var toDoRef = collection.doc(todoId );
        var getDoc = toDoRef.get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                    res.status(404).send('No such document!');
                    return
                } else {
                    toDoRef.delete().then(() => {
                            res.send("Deleted");
                        return
                        }).catch(err => {
                        console.log('Error getting document', err);
                        res.status(500).send(getDoc);
                        return
                    });


                }
                return
            })
            .catch(err => {
                console.log('Error getting document', err);
                res.status(500).send(getDoc);
                return
            });
    })

};