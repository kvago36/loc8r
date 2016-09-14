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
});

var locationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  rating:  {type: Number, "default": 0, min: 0, max: 5},
  facilities: [String],
  coords: {type: [Number], index: '2dspere', require: true},
  openningTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});

mongoose.model('Location' , locationSchema);
