/**
 * New node file
 */
var express		= require('express');
var router		= express.Router();


var Transaction		= require('../models/transactions');
var User     		= require('../models/users');
var Game     		= require('../models/games');
var Collection     	= require('../models/collections');

router
	.post('/', function(req, res){
		var newTransac = new Transaction({
			game_id: req.body.game_id ,
			buyer_id: req.body.buyer_id,
			seller_id: req.body.seller_id,
			price: req.body.price,
			'credits_after.buyer': req.body.creditBuyer,
			'credits_after.seller': req.body.creditSeller,
			transac_log: [{action: 'submit',log_date: Date.now()}],
		});
			
		newTransac.save(function(err, newTransac){
			if (err) res.send(err);
			
			Collection.findOne({ user_id: req.body.seller_id, game_id:req.body.game_id  }, function (err, doc){
				  doc.is_sold = newTransac._id;
				  doc.save();
			});		
			
			User.findById(newTransac.buyer_id, { user_name:1 }, function(err, user){
				if (err) res.send(err);
				
				var buyerName = user.user_name;
				
				//Set a Notifications
				var Utilities = require('./utilities');
				Utilities.setNotification(newTransac, 'buy', 'You have a request from ' + buyerName);
				
			})
			console.log(newTransac);
			
			return res.json({ status: 1, message: newTransac});
		});
	})
	.get('/', function(req, res){
		Transaction.find(function(err, transac){
			if(err) res.send(err);
			
			res.json(transac);
		})
	});

router
	.put('/:transaction_id', function(req, res){
		Transaction.findById( req.params.transaction_id, function(err, transaction) {
			if(!transaction) return res.json({ status: 0, message: "Transaction Not Found!"});
			if (err) res.send(err);			
			
			for (var fieldName in req.body) {
				//console.log(fieldName, req.body[fieldName]);
				if(req.body[fieldName]) {
					transaction[fieldName] = req.body[fieldName];
				}
			}

			transaction.save(function (err, transaction){
				if (err) res.send(err);
				return res.json({status: 1, message: transaction})
			});
		});
	})
//	.get('/:transaction_id')
	
module.exports = router;