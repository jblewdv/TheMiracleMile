/*
    -----------------------------
    Utilities module for MongoDB
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
const insertOneDoc = function (db, doc) {
	return new Promise((resolve) => {
		try {
			const collection = db.collection('miracles');
			collection.insertOne(doc, function (err, result) {
				assert.equal(err, null);
				console.log("Inserted a document into [miracles]");
				resolve(true);
			});
		} catch {
			resolve(false);
		}
	});
}

/*
    Finds documents with query and returns total count
*/
const countDocType = function (db, type) {
	return new Promise((resolve) => {
		try {
			const collection = db.collection('miracles');
			collection.find({ "type": type }).count().then((cnt) => {
				resolve(cnt)
			});
		} catch {
			resolve(false);
		}
	});
}

/*
	Finds documents by type
*/
const findDocsByType = function (db, type) {
	return new Promise((resolve) => {
		try {
			const collection = db.collection('miracles');
			collection.find({ 'type': type }).toArray(function (err, docs) {
				assert.equal(err, null);
				console.log("Query documents with type [" + type + "]");
				resolve(docs);
			});
		} catch {
			resolve(false);
		}
	});
}


/* 
	Returns all docs
*/
const findAllDocs = function (db) {
	return new Promise((resolve) => {
		try {
			const collection = db.collection('miracles');
			collection.find({}).toArray(function (err, docs) {
				assert.equal(err, null);
				console.log("Query all documents");
				resolve(docs);
			});
		} catch {
			resolve(false);
		}
	});
}

module.exports = {
	insertOneDoc,
	countDocType,
	findDocsByType,
	findAllDocs
};