angular.module('thehonorclub')
.controller('tabsController', function($scope, $state) {
  $scope.goToState = function(stateName) {
    $state.go(stateName);      
  }

});
