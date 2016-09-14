var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
mongoose.Promise = require('bluebird');

/* reviewsReadOne */
module.exports.reviewsReadOne = function (req, res) {
  console.log("Getting single review");
  if (req.params && req.params.locationid && req.params.reviewid) {
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(
        function(err, location) {
          console.log(location);
          var response, review;
          if (!location) {
            res.json(404, {
              "message": "locationid not found"
            });
            return;
          } else if (err) {
            res.json(400, err);
            return;
          }
          if (location.reviews && location.reviews.length > 0) {

            review = location.reviews.id(req.params.reviewid);
            console.log(review);
            if (!review) {
              res.json(404, {
                "message": "reviewid not found"
              });
            } else {
              response = {
                location: {
                  name: location.name,
                  id: req.params.locationid
                },
                review: review
              };
              res.json(200, response);
            }
          } else {
            res.json(404, {
              "message": "No reviews found"
            });
          }
        }
    );
  } else {
    res.json(404, {
      "message": "Not found, locationid and reviewid are both required"
    });
  }
};

/* reviewsCreate */
module.exports.reviewsCreate = function (req, res) {
  var locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findById(locationid)
      .select('reviews')
      .exet(
        function (err, location) {
          if (err) {
            res.json(404, err);
          } else {
            doAddReview(req, res, location);
          }
        }
      );
    } else {
      res.json(404, {
        "message": "Not found, locationid required"
      });
    }
};

/* doAddReview */
var doAddReview = function (req, res, location) {
  if (!location) {
    res.json(404, {
      "message": "locationid not found"
    });
  } else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save(function(err, location){
      var thisReview;
      if (err) {
        res.json(404, err);
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        res.json(201, thisReview);
      }
    });
  }
};

/* updateAverageRating */
var updateAverageRating = function (locationid) {
  console.log("Update rating average for ", locationid);
  Loc
    .findById(locationid)
    .select('reviews')
    .exec(
      function(err, location) {
        if (err) {
          res.json(404, err);
        } else {
          doSetAverageRating(location);
        }
      });
};

/* doSetAverageRating */
var doSetAverageRating = function (location) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10 );
    location.rating = ratingAverage;
    location.save(function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};

/* reviewsUpdateOne */
module.exports.reviewsUpdateOne = function (req, res) {
  if (!req.locationid || !req.reviewid) {
    res.json(404, {
      "message" : "locationid and reviewid are required"
    });
    return;
  }
  Loc
    .findById(req.locationid)
    .select('review')
    .exec(
      function(err, location) {
        var thisReview;
        if (!location) {
          res.json(404, {
            "message" : "locationid not found"
          });
          return;
        } else if (err) {
          res.json(404, err)
          return;
      }
      if (location.reviews && location.reviews.length > 0) {
        thisReview = location.reviews.id(req.params.reviewid);
        if (!thisReview) {
          res.json(404, {
            "message": "reviewid not found"
          });
        } else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save(function(err,location){
            if (err) {
              res.json(404, err)
            } else {
              updateAverageRating(location._id);
              res.json(200, thisReview)
            }
          });
        }
      } else {
        res.json(404, {
          "message": "No review to update"
        });
        }
      }
    );
};

/* reviewsDeleteOne */
module.exports.reviewsDeleteOne = function (req, res) {
  if (!req.params.reviewid || !req.params.locationid) {
    res.json(404, {
      "message": "Not found, locationid and reviewid are both required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('review')
    .exec(
      function(err, location) {
        if (err) {
          res.json(404, err)
        } else if (!location) {
          res.json(404, {
            "message": "Locationid Not found"
          });
          return;
        }
        if (location.reviews && location.reviews.lenth > 0) {
          if (!location.reviews.id(req.params.reviewid)) {
            res.json(404, {
              "message": "reviewid Not found"
            });
          } else {
            location.reviews.id(req.params.reviewid).remove();
            location.save(function(err) {
              if (err) {
                res.json(404, err)
              } else {
                updateAverageRating(location._id);
                res.json(204, null);
              }
            });
          }
        } else {
          res.json(404, {
            "message": "No review to delete"
          });
        }
      }
    );
};
