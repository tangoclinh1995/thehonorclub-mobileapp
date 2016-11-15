angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('eventInfo', {
    url: '/eventInfo',
    templateUrl: 'templates/eventInfo.html'
  });

});