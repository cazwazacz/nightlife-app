(function () {

  angular
    .module('main', ['ngResource', 'ngStorage'])
    .controller('results', ['$scope', '$resource', '$localStorage', function($scope, $resource, $localStorage) {

      const key = 'AIzaSyD3kuqSX4BHN4rNw3XvfCm_5yU4qQOHBFE';
      
      


      $scope.getResults = function (inputType) {        
        $scope.bars = [];

        // if (!$localStorage.input) {
        //   $localStorage.input = $scope.input;
        //   var Results = $resource('/bars/?search=' + $localStorage.input);
        //   $localStorage.input = undefined;
        // } else {
        //   var Results = $resource('/bars/?search=' + $localStorage.input);
        // }
        
        $localStorage.input = $scope.input;

        var Results = $resource('/bars/?search=' + inputType);

        var goingArr = [];

        Results.query(function (results) {
          results.forEach(function (element) {
            $scope.bars.push({
              name: element.name,
              photo: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=' + element.photos[0].photo_reference + '&key=' + key,
              rating: element.rating,
              id: element.id,
              going: goingArr.length
            });
          });
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

