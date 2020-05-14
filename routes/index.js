
/* express routing */
const express = require('express');
const router = express.Router();
require('dotenv').config()

/* load modules */
const moment = require('moment');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const NodeCache = require('node-cache');
const cache = new NodeCache();

/* load utilities */
const mongoUtils = require('../utils/mongo');
const dashboardUtils = require('../utils/dashboard');
const feedbackUtils = require('../utils/feedback');

/* connect to database client */
var db;
var MONGO_URL = process.env.MONGO_URL;
var DB_NAME = process.env.DB_NAME;

MongoClient.connect(MONGO_URL, { useUnifiedTopology: true }, function (err, client) {
	assert.equal(null, err);
	db = client.db(DB_NAME);
	console.log("Connected successfully to server");
});


/*
	----------
	MIDDLEWARE
	----------
*/

async function miracleCache(req, res, next) {
	if ((cache.get("miracleInfoSaved") != undefined || false) && cache.get("justShared") == false) {
		res.locals.dateInfo = cache.get("dateInfo");
		res.locals.typeCounts = cache.get("typeCounts");
		res.locals.miracles = cache.get("miracles");
		next();
	} 
	else {
		var typeCounts = await dashboardUtils.getTypeCounts(db);
		var miracles = await dashboardUtils.getDashboardMiracles(db, 100);

		var success = cache.mset([
			{ key: "dateInfo", val: [moment().format("dddd"), moment().format("MMMM Do, YYYY")] },
			{ key: "typeCounts", val: typeCounts },
			{ key: "miracles", val: miracles }
		]);
		
		if (success === true) {
			cache.set("miracleInfoSaved", true, 60);
			cache.set("justShared", false);
			res.redirect('/miracles');
		} else {
			cache.set("miracleInfoSaved", false, 60);
		}
	}
}


/*
	------
	ROUTES
	------
*/


router.get('/', function(req, res, next) {
	res.redirect('/home');
});


router.get('/home', function(req, res, next) {
	res.render('pages/home');
});


router.get('/miracles', miracleCache, async function (req, res, next) {
	res.render('pages/miracles', {
		dateInfo: res.locals.dateInfo,
		typeCounts: res.locals.typeCounts,
		miracles: res.locals.miracles,
		search: false
	});
});


router.post('/find', miracleCache, async function (req, res, next) {
	var keyword = req.body.keyword;
	
	if (keyword != '') {
		var miracles = await dashboardUtils.searchMiracles(db, keyword);
		
		res.render('pages/miracles', {
			dateInfo: res.locals.dateInfo,
			typeCounts: res.locals.typeCounts,
			miracles: miracles,
			search: true,
			searchTerm: keyword
		});
	} 
});


router.post('/share', async function (req, res, next) {
	var newMiracle = {
		'type': req.body.miracleType,
		'story': req.body.miracleStory,
		'created': new Date()
	}

	mongoUtils.insertOneDoc(db, newMiracle).then((status) => {
		if (status === true) {
			cache.set("justShared", true);
			res.redirect('/thankyou/miracle/success');
		} else {
			res.redirect('/thankyou/miracles/failure')
		}
	});
});


router.get('/thankyou/:type/:status', function(req, res, next) {
	res.render('pages/thankyou', {
		type: req.params.type,
		status: req.params.status
	});
});


router.post('/feedback', async function(req, res, next) {
	var newFeedback = {
		'from': req.body.feedbackFrom,
		'text': req.body.feedbackText,
		'created': new Date()
	};

	var success = await feedbackUtils.add(db, newFeedback);

	if (success === true) res.redirect('/thankyou/feedback/success');
	else res.redirect('/thankyou/feedback/failure');
});


router.get('/founder', function(req, res, next) {
	res.render('pages/founder');
});


router.get('/contact', function(req, res, next) {
	res.render('pages/contact');
});


module.exports = router;
