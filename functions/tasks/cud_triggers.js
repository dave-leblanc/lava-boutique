const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = {

    createTodo: functions.firestore
        .document('todo-list/{toDoId}')
        .onCreate((snap, context) => {
            const newValue = snap.data();

            var date = new Date();
            var new_data = {liveDate: date};

            return snap.ref.set(new_data, {merge: true});

        }),


    updateTodo: functions.firestore
        .document('todo-list/{toDoId}')
        .onUpdate((change, context) => {
            const newValue = change.after.data();
            const previousValue = change.before.data();

            var date = new Date();
            var new_data = {lastUpdateDate: date,postProcessed: true}

            if (previousValue.hasOwnProperty("lastUpdateDate")) {
                new_data.previousUpdateDate=previousValue.lastUpdateDate
            }
            if (!newValue.hasOwnProperty("postProcessed")||newValue.postProcessed===false){
                return change.after.ref.set(new_data, {merge: true});
            }
            return 0

        }),


    deleteTodo: functions.firestore
        .document('todo-list/{toDoId}')
        .onDelete((snap, context) => {
            const deletedValue = snap.data();
            var db = admin.firestore();
            console.log(snap.id);
            deleteCollection(db,'todo-list/'+snap.id+'/Items',20);

            return true;
        })
}


function deleteCollection(db, collectionPath, batchSize) {
    console.log(collectionPath)
    var collectionRef = db.collection(collectionPath);
    var query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
    query.get()
        .then((snapshot) => {
            // When there are no documents left, we are done
            if (snapshot.size === 0) {
                return 0;
            }

            // Delete documents in a batch
            var batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
                console.log('delete')
            });

            return batch.commit().then(() => {
                return snapshot.size;
            });
        }).then((numDeleted) => {
        if (numDeleted === 0) {
            resolve();
            return;
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
        return
    })
        .catch(reject);
}
