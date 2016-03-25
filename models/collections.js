/**
 * New node file
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Game     	= require('../models/games');
var User     	= require('../models/users');
var Transaction	= require('../models/transactions');

var CollectionSchema   = new Schema({
	user_id: {type: Schema.Types.ObjectId, ref: 'Users'},
	game_id: {type: Schema.Types.ObjectId, ref: 'Game'},
	platforms: Array,
	categories: Array,
	condition: String,
	price: {type: Number, 'default': 0},
	is_for_sale: {type: Boolean, 'default': false},	
	is_wishlist: {type: Boolean, 'default': false},
	is_sold: {type: Schema.Types.ObjectId, ref: 'Transaction', 'default':null},
  	updated: { type: Date, 'default': Date.now }
}, {collection:'collections'} );

module.exports = mongoose.model('Collection', CollectionSchema);