var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
mongoose.Promise = require('bluebird');

/* meterConversion*/
var meterConversion = (function() {
    var mToKm = function(distance) {
        return parseFloat(distance / 1000);
    };
    var kmToM = function(distance) {
        return parseFloat(distance * 1000);
    };
    return {
        mToKm : mToKm,
        kmToM : kmToM
    };
})()
/* theEarth */
var theEarth = (function() {
  var earthRadius = 6371;

  var getDistanceFromRads = function (rads) {
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = function (distance) {
    return parseFloat(distance/earthRadius);
  };

  return {
    getRadsFromDistance : getRadsFromDistance,
    getDistanceFromRads : getDistanceFromRads
  };
})();

/* locationsReadOne */
module.exports.locationsReadOne = function(req, res) {
   if (req.params && req.params.locationid) {
     Loc
      .findById(req.params.locationid)
      .exec(function(err, location) {
        if (!location) {
          res.json(404, {
            "message": "location id not found"
          });
          return;
        } else if (err) {
          res.json(404, err);
          return;
        }
          res.json(200, location);
      });
  } else {
    res.json(404, { "message": "No location id in request"});
 }
};

/* locationsCreate */
module.exports.locationsCreate = function (req,res) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coord: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
  }, function(err, location) {
    if (err) {
      res.json(404, err);
    } else {
      res.json(201, location);
    }
  });
};

/*locationsUpdateOne*/
module.exports.locationsUpdateOne = function (req, res) {
  if(!req.params.locationid) {
    res.json(404, {
      "message": "locationid is required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec(
      function(err, locationid) {
        if(!locationid) {
          res.json(404, {
            "message" : "locationid not found"
          });
          return;
        } else if (err) {
          res.json(404, err);
          return;
        }
        location.name = req.body.name;
        location.address = req.body.address;
        location.facilities = req.body.facilities.split(",");
        location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
        location.openingTimes = [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1,
        }, {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2,
        }];
        location.save(function(err, location){
          if (err) {
            res.json(404, err)
          } else {
            res.json(200, location)
          }
        });
      }
    );
};
/* GET list of locations */
module.exports.locationsListByDistance = function(req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: meterConversion.kmToM(maxDistance),
    //maxDistance: theEarth.getRadsFromDistance(maxDistance),
    num: 10
  };
  if ((!lng && lng!==0) || (!lat && lat!==0) || ! maxDistance) {
    console.log('locationsListByDistance missing params');
    res.json(404, {
      "message": "lng, lat and maxDistance query parameters are all required"
    });
    return;
  }
  Loc.geoNear(point, geoOptions, function(err, results, stats) {
    var locations;
    console.log('Geo Results', results);
    console.log('Geo stats', stats);
    if (err) {
      console.log('geoNear error:', err);
      res.json(404, err);
    } else {
      locations = buildLocationList(req, res, results, stats);
      res.json(200, locations);
    }
  });
};

var buildLocationList = function(req, res, results, stats) {
  var locations = [];
  results.forEach(function(doc) {
    locations.push({
      distance: meterConversion.mToKm(doc.dis),
      //distance: theEarth.getDistanceFromRads(doc.dis),
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    });
  });
  return locations;
};
/* locationsDeleteOne */
module.exports.locationsDeleteOne = function (req,res) {
  var locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findByIdAndRemove(locationid)
      .exec(
        function(err, location){
              if (err) {
                res.json(404, err);
                return;
              }
              res.json(204, null);
        }
      );
  } else {
    res.json(404, {
      "message": "No locationid"
    });
  }
};
