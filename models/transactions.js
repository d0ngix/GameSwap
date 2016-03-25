/**
 * New node file
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TransactionSchema = new Schema({
	game_id: {type: Schema.Types.ObjectId, ref: 'Game'},
	buyer_id:  {type: Schema.Types.ObjectId, ref: 'User'},
	seller_id:  {type: Schema.Types.ObjectId, ref: 'User'},
	price: {type: Number},
	credits_after: {
		buyer: {type: Number},
		seller: {type: Number}
	},
	created: {type: Date},
	is_accepted: {type: Number, 'default':0},
	is_notified: {type: Number, 'default':0},
	is_replied: {type: Number, 'default':0},
	transac_log : []
});

module.exports = mongoose.model('Transaction', TransactionSchema);