'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Place = new Schema({
	id: String,
	going: Array
});

module.exports = mongoose.model('Place', Place);