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



/*
    Finds documents with query and returns total count
*/
const ipExists = function (db, ip) {
	return new Promise((resolve, reject) => {
		try {
			const collection = db.collection('userGeo');
			collection.find({ "ip": ip }).count().then((cnt) => {
                if (cnt > 0) resolve(true)
                else resolve(false)
			});
		} catch {
			reject('ipExists error');
		}
	});
}


/*
    Inserts one doc into collection: col
*/
const insertNewGeo = function (db, geo, ip) {
	return new Promise((resolve, reject) => {
		try {
            if (ipExists(db, ip) == false) {
                const collection = db.collection('userGeo');
                collection.insertOne(geo, function (err, result) {
                    assert.equal(err, null);
                    console.log("Inserted a document into [userGeo]");
                    resolve(true);
                });
            }
            else resolve(false)
			
		} catch {
			reject('insertNewGeo error');
		}
	});
}


module.exports = {
	insertNewGeo,
	ipExists,
};