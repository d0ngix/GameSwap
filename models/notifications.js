/**
 * New node file
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var NotificationSchema = new Schema({
	ref_id : {type: Schema.Types.ObjectId},//if the notification is for transaction related (transaction_id), or user_id if initiated by a user
	user_id: [{type: Schema.Types.ObjectId, ref: 'User'}],//if the notification is intended to a particular user or users
	message: String,
	view_log: [{user_id:String, view_date:{type:Date}}],//user id of the viewer and when it is viewed.
	type: {type:String, enum: ['buy','notice','warning','alert','poke'] },
	created: {type: Date, 'default': Date.now},
});

module.exports = mongoose.model('Notification', NotificationSchema);