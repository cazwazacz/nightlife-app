'use strict';

var Users = require('../models/users.js');
var Places = require('../models/places.js');

function searchHandler () {

    this.goingThere = function (req, res) {
    	if (req.isAuthenticated()) {
    		var placeId = req.body.placeId;
    		var userid = req.user.twitter.id;

        Places.findOne({id: placeId}, function (err, place) {
              if (err) {throw err;}
              else if (place) {
                if (place.going.indexOf(userid) < 0) {
                  place.going.push(userid); 
                  place.save();
                } else {
                  var index = place.going.indexOf(userid);
                  place.going.splice(index, 1);
                  place.save();
                }

              } else {
               var newPlace = new Places();
                
                newPlace.id = placeId
                newPlace.going.push(userid);

                newPlace.save(); 
              }
            }); 

            
            // Places.findOne({id: placeId}, function (err, place) {
            //   if (err) {throw err;}
            //   else if (place) {
            //     console.log('foundplace');
            //     //place.update({id: placeId}, {$push:{going: 'hello'}})
            //     var newList = place.going.push(userid);
            //     console.log(newList);
            //  	  place.going.push(userid); 
            //   } else {
            //   	var newPlace = new Places();
                
            //     newPlace.id = placeId
            //     newPlace.going.push(userid);

            //     newPlace.save(); 
            //   }
            // }); 
    	} 
    };

    this.getGoers = function (req, res) {
      Places.find({id: req.params.placeId})
        .exec(function (err, result) {
          if (err) {throw err;}
          res.json(result[0]);
        })
    };

};

module.exports = searchHandler;