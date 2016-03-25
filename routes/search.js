/**
 * New node file
 */

var express = require('express');
var router = express.Router();

var Collection = require('../models/collections');
var User = require('../models/users');
var Game = require('../models/games');

/*
router
	.get('/:model', function(req, res){
		
		if(!req.param('model')) return res.json({status: 0, message: 'model not set!'});
		if(!req.param('q')) return res.json({status: 0, message: 'query not set!'});
		if(!req.param('f')) return res.json({status: 0, message: 'field not set!'});
		
		var q = new RegExp(req.param('q'), 'i');
		
		var arrField = req.param('f');	
		var strModel = req.param('model');
		var objModel = require('../models/' + strModel);		
		
		//Setup the where clause
		if(arrField){
			var strWhere = '';
			var objWhere = {};
			var objVal = {};
			var arrWhere = [];
			arrField.split(',').forEach(function(field, index){
				objVal['$regex'] = q;
				objWhere[field] = objVal;
				arrWhere[index] = objWhere;
			});		
			
			objModel.find().or(arrWhere).exec(function(err, result) {
				return res.json({ status: 1, message: result});
			});
		}		
	});
*/

router.get('/', function(req, res){
	//route the event
	var eventObj = {
		getSellerList : function (objParam) {		
			var objWhere = {
				game_id:objParam.game_id,
				is_for_sale: 1,
			};
				
			Collection
				.find(objWhere).select({price:1, platforms:1, condition:1, user_id:1, game_id:1})
				.populate('user_id', {user_name:1,email:1})
				//.populate('game_id')
				.exec(function(err, doc){
					if(err) res.send(err);
					if (!doc.length) return res.json({status: 0, message: 'Game Not Found!'});

					var utilities = require('./utilities');
					utilities.getUserRatings(doc, function (newDoc){
						res.json({status:1, message: newDoc})
					});										
			});
		}//End getSellerList by game_id 
	};
	
	eventObj[req.param('action')](req.query);
		
});



module.exports = router;
