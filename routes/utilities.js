/**
 * New node file
 */
var User     		= require('../models/users');
var Notification	= require('../models/notifications');
var Collection		= require('../models/collections');

module.exports = {
		/* *
		 * getUserRatings - retrieve user ratings
		 * @params
		 * - objList - User Object
		 * - callback
		 * @return Obj - weight averge user rating  
		 * */	
		getUserRatings: function  (objList , callback) {
			var results = [];
			objList.forEach ( function (obj, i) {
				async(obj, function(result){
					results.push(result);
					if(results.length == objList.length)
						callback(results); 
					
				})
			});
			
			function async(arg, callback) {
				//Get Ratings
				User.findOne({_id:arg.user_id.id}, {email:1, ratings:1, user_name:1},function(err, user){
					var five = four = three = two = one = 0;
					if ( typeof user.ratings.five != 'undefined' ) 	five	= user.ratings.five;
					if ( typeof user.ratings.four != 'undefined' ) 	four 	= user.ratings.four;
					if ( typeof user.ratings.three != 'undefined' )	three	= user.ratings.three;
					if ( typeof user.ratings.two != 'undefined' )	two		= user.ratings.two;
					if ( typeof user.ratings.one != 'undefined' )	one		= user.ratings.one;
				
					//weighted average
					ratings = ( 5 * five + 4 * four + 3 * three + 2 * two + 1 * one ) / ( five + four + three + two + one );

					arg.user_id.ratings = ratings
					callback(arg);					
				});				
			}
		},
		
		
		/* *
		 * updatePrices - udpate the prices on a particular game
		 * @params
		 * - game - Object
		 * - game_id - String
		 * - platform - String
		 * @return Obj 
		 * - { usedItem: { avg: 15, low: 10, high: 20 }, newItem: { avg: 50, low: 50, high: 50 } }  
		 * @procedure
		 * - search all the games in users collections based on game_id and platform
		 * - iterate the result and get high/low/avg
		 * - update the game  
		 * */		
		updatePrices: function(objGame, game_id, platform) {

			Collection.find({game_id: game_id, platforms:platform}, function (err, collection){
				if (err) res.send(err);

				var prices = {usedItem:{avg: null, low: null, high: null, platform: platform.join()}, newItem:{avg: null, low: null, high: null, platform:platform.join() }};
				var usedCounter = newCounter = 0;
				
				collection.forEach(function(obj){
					if ( obj.condition.toLowerCase() == 'used' ) {
						usedCounter++;
						if ( prices.usedItem.low == null || obj.price < prices.usedItem.low ) prices.usedItem.low = obj.price; 
						if ( prices.usedItem.high == null || obj.price > prices.usedItem.high) prices.usedItem.high = obj.price;
						prices.usedItem.avg = prices.usedItem.avg + obj.price;

					} else if ( obj.condition.toLowerCase() == 'new' ) { 
						newCounter++;
						if ( prices.newItem.low == null || obj.price < prices.newItem.low ) prices.newItem.low = obj.price; 
						if ( prices.newItem.high == null || obj.price > prices.newItem.high) prices.newItem.high = obj.price;
						prices.newItem.avg = prices.newItem.avg + obj.price;				

					}		
				});
				prices.usedItem.avg = prices.usedItem.avg / usedCounter;
				prices.newItem.avg = prices.newItem.avg / newCounter;
				
		/*						   	
				"statistics": {
					"prices": {
						"usedItem": [{"avg":16.25, "low":10, "high":20, "platform":"PS3"}, {"avg":16.25, "low":10, "high":20, "platform":"XBOX"}],
						"newItem": {"avg": 50, "low": 50, "high": 50, "platform": "PS3"}
					},
					"hits": 0,
					"counter": [ ]
				},
		*/
				//Used Games
				var usedItemFoundFlag = false;
				if (usedCounter) {
					objGame.statistics.prices.usedItem.forEach(function(obj,i){
						if(obj.platform == platform.join()){
							//obj.avg
							objGame.statistics.prices.usedItem[i].avg = prices.usedItem.avg;
							objGame.statistics.prices.usedItem[i].high = prices.usedItem.high;
							objGame.statistics.prices.usedItem[i].low = prices.usedItem.low;
							usedItemFoundFlag = true;
						}
					});
				}		
				if (!usedItemFoundFlag && objGame.statistics.prices.usedItem.length == 0) objGame.statistics.prices.usedItem.push(prices.usedItem);
				//console.log(objGame.statistics.prices.usedItem);

				//New Games
				var newItemFoundFlag = false;
				if (newCounter) {
					objGame.statistics.prices.newItem.forEach(function(obj,i){
						if(obj.platform === platform.join()){
							//obj.avg
							objGame.statistics.prices.newItem[i].avg = prices.newItem.avg;
							objGame.statistics.prices.newItem[i].high = prices.newItem.high;
							objGame.statistics.prices.newItem[i].low = prices.newItem.low;
							newItemFoundFlag = true;
						}
					});
				}		
				if (!newItemFoundFlag && objGame.statistics.prices.newItem.length == 0) objGame.statistics.prices.newItem.push(prices.newItem);		
				//console.log(objGame.statistics.prices.newItem)
				
				//console.log(objGame.statistics.prices);
				objGame.save(function (err, game1){
					if (err) res.send(err);
					//console.log(game1.statistics.prices);
				}); 

			});
		},		

		/* *
		 * setNotification
		 * */
		setNotification: function ( obj, type, message ) {
			//type = ['Buy','Notice','Warning','Alert']
			
			if(type == 'Buy') { //Notification after user buying
				
				var newNotification = new Notification({
					ref_id: obj._id,
					user_id: obj.seller_id,
					message: message,
					type: type,
				});
			}
			
			newNotification.save(function(err, notification){
				if(err) res.send(err);
				
				//TODO: To send notification via Parse
			});
		},
}