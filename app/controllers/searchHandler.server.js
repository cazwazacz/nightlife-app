'use strict';

var Users = require('../models/users.js');
var Places = require('../models/places.js');

function searchHandler () {

    this.goingThere = function (req, res) {
    	if (req.isAuthenticated()) {
    		console.log(req.body);
    		console.log(req.user.twitter.id);
    	} else {
    		res.redirect('/auth/twitter');
          
    	}

    };

};

module.exports = searchHandler;