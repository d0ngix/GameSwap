var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsersSchema   = new Schema({
	device_token: String, 
	email: String,
	user_name: String,
	password: String,
	credits: Number,
	trade_method: {},
	login_method: String,
	photo: String,
	is_admin: {type: Number, 'default': 0},
	dob: Date,
	gender: String,
	photo: String,
	address: String,
	contact_num: Number,
	platforms: Array,
	categories: Array,	
  	updated: { type: Date, 'default': Date.now },
  	ratings: {
  		five: {type: Number, 'default':0},
  		four: {type: Number, 'default':0},
  		three: {type: Number, 'default':0},
  		two: {type: Number, 'default':0},
  		one: {type: Number, 'default':0}, 
  	},
  	secret_key: String,
  	login_logs: [{
  		token: String,
  		token_expiry: Date, //- update expiry everytime user connects
  		login_date: Date,
  		ip_addresss: String,
  		device: String,
  		os: String,
  	}],
}, {collection: 'users'} );

module.exports = mongoose.model('Users', UsersSchema);