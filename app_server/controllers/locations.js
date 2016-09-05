/* GET 'home' page */
module.exports.homeList = function(req,res) {
  res.render('locations-list' , { title: 'Home'});
};

/* GET 'Location info' page */
module.exports.locationInfo = function (req,res) {
  res.render('location-info' , { title: 'location Info'});
};

/* GET 'Add review' page */
module.exports.addReview = function (req,res) {
  res.render('location-review-form' , { title: "Add review"});
};