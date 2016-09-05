var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');



/* Locations pages */
router.get('/', ctrlLocations.homeList);
router.get('/locations', ctrlLocations.locationInfo);
router.get('/locations/review/new' , ctrlLocations.addReview);

/* Other pages */
router.get('/about' , ctrlOthers.about);

module.exports = router;
