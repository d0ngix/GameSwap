/**
 * New node file
 */
var router = require('express').Router();
var Notification = require('../models/notifications');
var Transaction = require('../models/transactions');

router
	.get('/:user_id', function(req, res){
		Notification.find({user_id: req.params.user_id}, function(err, notification){
			if (err) res.send(err);
			res.json(notification);
		});
	})

	.put('/:_id', function(req, res){
		Notification.findOne({_id:req.params._id},function(err, notification){
			notification.view_log.push({user_id: req.body.user_id, view_date: Date.now()}); 
			notification.save(function(err,doc){
				if (err) res.send(err);
				res.json({status:1, message: doc});				
			});
		});
	})	
	
	.post('/:type', function(req, res){
		var notification = new Notification({
			message: req.body.message,
			ref_id: req.body.user_id_from,
			user_id: req.body.user_id_to,
			type: req.params.type.toLowerCase()
		});
		
		notification.save(function(err, doc){
			if (err) res.send(err);
			res.json({status:1, message: doc});
		});
	})
	

module.exports = router;