/*
    -----------------------------------
    Utilities module for Dashboard page
    -----------------------------------
*/

const assert = require('assert');
const mongoUtils = require('./mongo');

/*
    ---------
    Functions
    ---------
*/

/* 
	Returns total count for each Miracle type 
*/
const getTypeCounts = async function (db) {
	try {
		var rs = await mongoUtils.countDocType(db, 'Relationships saved');
		var so = await mongoUtils.countDocType(db, 'Sins overcame');
		var mh = await mongoUtils.countDocType(db, 'Mental issues healed');
		var ph = await mongoUtils.countDocType(db, 'Physical issues healed');
		return [rs, so, mh, ph];
	} catch {
		return null;
	}
}


/* 
	Returns basic Miracles for dashboard
*/
const getDashboardMiracles = function (db, limit) {
	return new Promise((resolve) => {
		try {
			const collection = db.collection('miracles');
			collection.find({}).limit(limit).toArray(function (err, docs) {
				assert.equal(err, null);
				console.log("Query some documents for dashboard");
				resolve(docs);
			});
		} catch {
			resolve(false);
		}
	});
}


/* 
	Finds miracles by searched keyword
*/
const searchMiracles = function (db, keyword) {
	return new Promise((resolve) => {
		try {
			const collection = db.collection('miracles');
			collection.find({ "story": { $regex: ".*" + keyword + ".*" } }).toArray(function (err, docs) {
				assert.equal(err, null);
				console.log("Query documents with keyword [" + keyword + "]");
				resolve(docs);
			});
		} catch {
			resolve(false);
		}
	});
}

module.exports = {
	getTypeCounts,
	getDashboardMiracles,
	searchMiracles
};