/*
    -----------------------------
    Utilities module for Feedback
    -----------------------------
*/

const assert = require('assert');


/*
    ---------
    Functions
    ---------
*/

/*
    Inserts one doc into collection: col
*/
const add = function (db, doc) {
	return new Promise((resolve) => {
		try {
			const collection = db.collection('feedback');
			collection.insertOne(doc, function (err, result) {
				assert.equal(err, null);
				console.log("Inserted a document into [feedback]");
				resolve(true);
			});
		} catch {
			resolve(false);
		}
	});
}


module.exports = { add };