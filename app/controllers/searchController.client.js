var target = document.getElementById('spinner');
var spinner = new Spinner().spin();
target.appendChild(spinner.el);

(function () {

  angular
    .module('main', ['ngResource', 'ngStorage'])
    .controller('results', ['$scope', '$resource', '$localStorage', '$window', '$timeout', function($scope, $resource, $localStorage, $window, $timeout) {

      const key = 'AIzaSyD3kuqSX4BHN4rNw3XvfCm_5yU4qQOHBFE';

      

      var Going = $resource('/going'); 

      $scope.getGoers = function (placeId) {
                                             

        var Goers = $resource('/api/' + placeId + '/getgoers')
        Goers.get(function(goers) {

          if (goers.going != undefined) {
             return (goers.going.length);

          } else {
            return 0;
          }
          //return goers.going.length;
        });
      }
      

      $scope.getResults = function (inputType) {  
        $scope.loading = true;       
        $scope.bars = [];
        
        if ($scope.input) {
          $localStorage.input = $scope.input;
        }       

        var Results = $resource('/bars/?search=' + inputType);

        var goingArr = [];

        Results.query(function (results) {
          results.forEach(function (element) {
            var Goers = $resource('/api/' + element.id + '/getgoers');

            Goers.get(function(goers) {
            var numberOfGoers;
            if (goers.going != undefined) {
               numberOfGoers = (goers.going.length);

            } else {
              numberOfGoers = 0;
            } 

            $scope.bars.push({
              name: element.name,
              photo: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=' + element.photos[0].photo_reference + '&key=' + key,
              rating: element.rating,
              id: element.id,
              going: numberOfGoers
            });
            });
            
          });
          $scope.loading = false;
        });

      };

      function function1(placeId, callback) {
        Going.save({placeId: placeId});
          $timeout(function() {callback()}, 500);
        //$setTimeout(callback(), 5000);
      }

      function function2(placeId) {
        var Goers = $resource('/api/' + placeId + '/getgoers')

        Goers.get(function(goer) {
          
          var findId = goer.id;

          // if (goer.hasOwnProperty('going')) {
            var numberOfGoers = goer.going.length;
            
            $scope.bars.forEach(function (element) {

              if (element.id == findId) {
                element.going = numberOfGoers;
              }

            });
          // }
        });
      }

      // function1(placeId, function () {
      //   function2(placeId);
      // });

      $scope.goingThere = function (placeId) {

        function1(placeId, function () {
          function2(placeId);
        });

      };

      if ($localStorage.input) {
        $scope.getResults($localStorage.input);
      }

      $scope.clearLocalStorageInput = function () {
        $localStorage.input = undefined;
      }

    }])

})();

