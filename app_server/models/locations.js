var mongoose = require( 'mongoose' );

var openingTimeSchema = new mongoose.Schema({
  day: { type: String, require: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, require: true}
})

var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {type: Number , "default":0, require: true , max: 5 , min: 0},
  createdOn: {type: Date , "default": Date.now },
  reviewText: String
})

var locationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  rating:  {type: Number, "default": 0, min: 0, max: 5},
  facilities: [String],
  coords: {type: [Number], index: '2dspere'},
  openningTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});

mongoose.model('locations' , locationSchema);

/*
db.locations.save({
  name: 'Starcups',
  address: '125 High Street, Reading, RG6 1PS',
  rating: 3,
  facilities: ['Hot drinks', 'Food', 'Premium wifi'],
  coords: [-0.9690884, 51.455041],
  openingTimes: [{
    days: 'Monday - Friday',
    opening: '7:00am',
    closing: '7:00pm',
    closed: false
  }, {
    days: 'Saturday',
    opening: '8:00am',
    closing: '5:00pm',
    closed: false
  }, {
    days: 'Sunday',
    closed: true
  }],
  reviews: {
    author: 'Simon Holmes',
    id: ObjectId(),
    rating: 5,
    timestamp: new Date("Jul 16, 2013"),
    reviewText: "What a great place. I can't say enough good things about it."
  }
})



> db.locations.update({
  name: 'Starcups'
}, {
  $push: {
    reviews: {
      author: 'Simon Holmes',
      id: ObjectId(),
      rating: 5,
      timestamp: new Date("Jul 16, 2013"),
      reviewText: "What a great place. I can't say enough good things about it."
    }
  }
})

*/
