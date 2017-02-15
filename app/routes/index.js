'use strict';
require('dotenv').load();

var dir = process.cwd();

var SearchHandler = require(dir + '/app/controllers/searchHandler.server.js')

var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_PLACES_APIKEY
});

module.exports = function(app, passport) {

  var searchHandler = new SearchHandler();

  app.route('/')
    .get(function(req, res) {
      if (req.isAuthenticated()) {
        res.render('index', {loggingHref: '/logout', loginFunc: 'clearLocalStorageInput()', logButton: 'log out'});
      } else {
        res.render('index', {loggingHref: '/auth/twitter', loginFunc: '', logButton: 'log in'});
      }
    });

  app.route('/bars/').get(function(req, res) {
      googleMapsClient.places({
        query: req.query.search,
        type: 'bar'
    }, function(err, response) {
        if (!err) {
            res.json(response.json.results);
        }
    });
    });

  app.route('/going')
    .post(searchHandler.goingThere);

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/');
    });

  app.route('/auth/twitter')
    .get(passport.authenticate('twitter'));


  app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });    
 
};
