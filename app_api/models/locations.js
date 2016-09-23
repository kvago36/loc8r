var mongoose = require( 'mongoose' );

var openingTimeSchema = new mongoose.Schema({
  day: { type: String, require: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, require: true}
})

var reviewSchema = new mongoose.Schema({
  author: {type: String, required: true},
  rating: {type: Number , "default":0, require: true , max: 5 , min: 0},
  createdOn: {type: Date , "default": Date.now },
  reviewText: {type: String, required: true}
});

var locationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  rating:  {type: Number, "default": 0, min: 0, max: 5},
  facilities: [String],
  coords: {
        type: [Number],
        index: '2dsphere',
        required: true
  },
  openningTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});

mongoose.model('Location' , locationSchema);
