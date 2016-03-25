var express = require('express');
var router = express.Router();

var parse = require('parse');

var User     = require('../models/users');
router
	.post('/', function(req, res){
		//check if email already exist
		var query  = User.where({ email:  req.body.email});
		query.findOne(function (err, user) {
			if (err) res.send(err);
			
			if (user) {
			    // doc may be null if no document matched
				return res.send({status:false, message:"Email address already exist!", _id:user._id});
			} 

			//insert new user
			var newUser = new User({ 
				email: req.body.email,
				userName: req.body.user_name,
				password: req.body.password,
				credits: req.body.credits,
				photo: req.body.photo,
				loginMethod: req.body.login_method, 
				deviceToken: req.body.device_token, 
			});
			newUser.save(function (err, newUser){
				  if (err) res.send(err);				  
				  return res.json({ status: 1, message: newUser});
			});					
 
		});		
	})
	.get('/', function(req, res){
		User.find (function(err, users) {
			if (err) res.send(err);
			if(!users.length) return res.json({status: 0, message: users});
			
			return res.json({status: 1, message: users});
		});			
	});

router
	.put('/:user_id', function(req, res){
		User.findById( req.params.user_id, function(err, user) {
			if(!user) return res.json({ status: 0, message: "User Not Found!"});
			if (err) res.send(err);			
			
			var ratings = ['one','two','three','four','five'];
			for (var fieldName in req.body) {

				if(req.body[fieldName]) {
					if (fieldName == 'ratings') {
						var strRatings = ratings[(req.body[fieldName] - 1)]; 
						user.ratings[strRatings] = user.ratings[strRatings] + 1;
						continue;
					}
					user[fieldName] = req.body[fieldName];
				}
			}

			user.save(function (err, user){
				if (err) res.send(err);
				return res.json({status: 1, message: user})
			});
		});
	})
	.get('/:user_id', function(req, res){
		User.findById( req.params.user_id, function(err, user) {
			if(!user) return res.json({ status: false, message: "User Not Found!"});
			if (err) res.send(err);
			
			
			
			return res.json({status: 1, message:user});
		});
			
	})
	.delete('/:user_id', function(req, res){
		User.remove( { _id: req.params.user_id }, function( err, user ){
			if(!user) return res.json({ status: 0, message: "User Not Found!"});
			if (err) res.send(err);
			
			return res.json({status: 1, message: 'User Deleted Successfully!'});
		});
	});	

module.exports = router;
