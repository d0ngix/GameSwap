var express = require('express');
var router = express.Router();

var Game     = require('../models/games');
router
	.post('/', function(req, res){
		var newGame = new Game({ 
			name: req.body.name,
			release_date: req.body.release_date,
			platforms: req.body.platforms,
			category: req.body.category,
			ratings: req.body.ratings,
			'cover_photo.thumbnail': req.body.thumbnail,
			'cover_photo.full_image': req.body.full_image,
			review_url: req.body.review_url,
		});
		newGame.save(function (err, newGame){
			  if (err) res.send(err);
			  return res.json({ status: 1, message: newGame});
		});		
	})
	.get('/', function(req, res){
		var query = Game;
		
		if(req.param('updated')){
			query = Game.where( { 
				updated: {
					$gte: new Date(req.param('updated'))
				}  
			});
		}
		//console.log(new Date(req.param('updated')).toISOString());
		query.find (function(err, games) {
			if (err) res.send(err);
			return res.json({ status: 1, message: games});
		});
		
//		Game.find (function(err, games) {
//			if (err) res.send(err);
//			return res.json({ status: 1, message: games});
//		})
			
	});

router
	.put('/:game_id', function(req, res) {
		Game.findById( req.params.game_id, function(err, game) {
			if(!game) return res.json({ status: 0, message: "Game Not Found!"});
			if (err) res.send(err);
			
			var isUpdateFieldFlag = false;
			
			for (var fieldName in req.body) {
				//console.log(fieldName, req.body[fieldName]);
				if(req.body[fieldName]) {
					game[fieldName] = req.body[fieldName];					
					isUpdateFieldFlag = true;
				}
			}			
			
			if(isUpdateFieldFlag) game.updated = new Date();
			
			game.save(function (err, game){
				if (err) res.send(err);
				return res.json({ status: 1, message: game});				
			});
		});
	})
	.get('/:game_id', function(req, res){
		Game.findById( req.params.game_id, function(err, game) {
			if(!game) return res.json({ status: 0, message: "Game Not Found!"});
			if (err) res.send(err);
			game.statistics.hits += 1;
			game.save(function (err, game){
				if (err) res.send(err);
				return res.json({ status: 1, message: game});
			});			
			//res.json(game);
		});
			
	})
	.delete('/:game_id', function(req, res){
		Game.remove( { _id: req.params.game_id }, function( err, game ){
			if(!game) return res.json({ status: 0, message: "Game Not Found!"});
			if (err) res.send(err);
			
			return res.json({ status: 1, message: 'Game Deleted Successfully!'});
		});
	});	

module.exports = router;
