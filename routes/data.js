var express = require('express');
var router = express.Router();
var csv = require('csvtojson');
var path = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
	let csvFilePath = path.resolve("./routes/Prescriber_Data.csv");

	csv()
	.fromFile(csvFilePath)
	.then(function(jsonArrayObj){ //when parse finished, result will be emitted here.
		res.send(jsonArrayObj); 
	})
});

module.exports = router;