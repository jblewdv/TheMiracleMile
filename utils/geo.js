/*
    --------------------------------
    Utilities module for GeoLocation
    --------------------------------
*/

const assert = require('assert');


/*
    ---------
    Functions
    ---------
*/

const addVisitorLocation = function (db, doc) {
	return new Promise((resolve, reject) => {
		try {
            const collection = db.collection('userGeo');
            collection.insertOne(doc, function (err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into [userGeo]");
                resolve(true);
            });
		} catch {
			reject('insertNewGeo error');
		}
	});
}


module.exports = {
	addVisitorLocation
};