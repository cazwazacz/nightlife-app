'use strict';
require('dotenv').load();

var dir = process.cwd();

var SearchHandler = require(dir + '/app/controllers/searchHandler.server.js')

var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_PLACES_APIKEY
});

module.exports = function(app, passport) {

  var searchHandler = new SearchHandler();

  var goingButtonLoggedIn = '<input class="btn btn-default" type="submit" value="{{ bar.going }} going">';
  var goingButtonNotLoggedIn = '<a href="/auth/twitter"><input type="button" class="btn btn-default" value="{{ bar.going }} going"></a>';
  var loginTwitterButton = '<span class="fa fa-twitter"></span>  twitter log in'

  app.route('/')
    .get(function(req, res) {
      if (req.isAuthenticated()) {
        res.render('index', {loggingHref: '/logout', loginFunc: 'clearLocalStorageInput()', logButton: 'log out', goingButton: goingButtonLoggedIn});
      } else {
        res.render('index', {loggingHref: '/auth/twitter', loginFunc: '', logButton: loginTwitterButton, goingButton: goingButtonNotLoggedIn});
      }
    });

  app.get('/api/userinfo', function (req, res) {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.json({twitter : {id: 'unauthenticated'}});
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

  app.route('/api/:placeId/getgoers')
    .get(searchHandler.getGoers);

  app.route('/going')
    .post(searchHandler.goingThere);

  app.route('/logout')
    .get(function (req, res) {
      console.log(req.session.passport.user);
      req.logout();
      res.redirect('/');
    });

  app.get('/auth/twitter',
    function (req, res, next) {
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Origin', '*');
      next();
    },
    passport.authenticate('twitter'));

  // app.route('/auth/twitter')
  //   .get(passport.authenticate('twitter'));


  app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });    
 
};
