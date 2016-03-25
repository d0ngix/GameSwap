var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var GameSchema   = new Schema({
	name: String,
	release_date: Date,
	platforms: Array,
	category: {type: String, 'default':null},
	ratings: Number,
	statistics: {
		prices: {usedItem:[],newItem:[]},//[{platform:PS3, condition:used, avg:Number, high:Number, low: Number}, ]
		counter: Array,//[{platform:PS3, seller: Number, buyer: Number }, ]
		//ratings: {ign:Number},
		hits: {type: Number, 'default': 0}
	},
	//hits: {type: Number, 'default': 0},
	cover_photo: {
		thumbnail: String,
		full_image: String,
	},
	review_url: String,
  	updated: { type: Date, 'default': Date.now }
}, {collection: 'games'});

module.exports = mongoose.model('Game', GameSchema);