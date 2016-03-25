/**
 * New node file
 */

var express = require('express');
var router = express.Router();

var Collection     = require('../models/collections');
var User     = require('../models/users');
var Game     = require('../models/games');
var Utilities = require('./utilities');

router
	.post('/', function(req, res){
		//Check if user_id and game_id exist
		var countColletion = Collection.count({user_id: req.body.user_id, game_id: req.body.game_id}, function (err, count){			
			
			if(err) res.send(err);
			if(count) return res.json({status: 0, message:'Game already exist in your collection!'});
			
			User.findById(req.body.user_id, function(err, user){
				if(err) res.send(err);
				if(!user) return res.json({status: 0, message:'User Not Found!'});

				//Find Game
				Game.findById(req.body.game_id, function(err, game) {
					if(err) res.send(err);
					if(!game) return res.json({status: 0, message:'Game Not Found!'});
					
					var objCollection = {};
					
					for (var fieldName in req.body) {
						//console.log(fieldName, req.body[fieldName]);
						if(req.body[fieldName]) {
							objCollection[fieldName] = req.body[fieldName];
						}
					}				
					
					var newCollection = new Collection(objCollection);
					
					newCollection.save(function (err, newCollection){
						  if (err) res.send(err);
						  
						  /*Update Games statistics*/
						  //updatePrices(game, req.body.game_id, req.body.platforms);
						  Utilities.updatePrices( game, req.body.game_id, req.body.platforms, function (newDoc){
								res.json({status:1, message: newDoc})
							});	
						  
						  return res.json({status: 1, message: newCollection});
					});				
					
				});			
			});			
		});
		//return console.log(countCollection);
	})	
	.get('/', function(req, res){
		// api/collections/?user_id=547c1fce3deccdcc01b0742c
		// http://localhost:8080/api/search/collections?q=547c1fce3deccdcc01b0742c&f=user_id
		
		if(!req.param('user_id')) return res.json({status: 0, message: "User Id Not Set"});
		
		var objWhere = {user_id: req.param('user_id')};
		
		if(req.param('updated')) objWhere.updated = { $gte: new Date(req.param('updated')) };  
		
		Collection
			//.find({user_id: req.param('user_id')})
			.find(objWhere)
			.populate(['game_id','is_sold'])
			.exec(function(err, doc){
				if(err) res.send(err);
				if (!doc.length) return res.json({status: 0, message: "Collection Not Found!"});

				return res.json( {status: 1, 'message': doc} );
			});			
	});

router
	.put('/:collection_id', function(req, res){
		Collection.findById( req.params.collection_id, function(err, collection) {
			if (err) res.send(err);
			if (!collection) return res.json({status: 0, message: "Collection Not Found!"});
			
			for (var fieldName in req.body) {
				if(req.body[fieldName]) {
					collection[fieldName] = req.body[fieldName];
				}
			}		
			
			collection.save(function (err, collection){
				if (err) res.send(err);
				res.json({status: 1, message: collection})
			});
		});
	})
	.get('/:collection_id', function(req, res){
		
		Collection
			.findById( req.params.collection_id)
			.populate('game_id')
			.exec(function(err, doc){
				if(err) res.send(err);		
				if(!doc) return res.json({status: 0, message: "Collection Not Found!"})
				
				return res.json({status: 1, message: doc});
			});
			
	})
	.delete('/:collection_id', function(req, res){
		Collection.remove( { _id: req.params.collection_id }, function( err, collection ){
			if (err) res.send(err);
			if (!collection) return res.json({status: 0, message: "Collection Not Found!"});
			
			res.json({status: 1, message: 'Collection Deleted Successfully!'});
		});
	});	




module.exports = router;
