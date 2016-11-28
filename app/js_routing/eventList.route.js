angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('eventList', {
    url: '/eventList',
    templateUrl: 'templates/eventList.html',
    controller: "eventListController"
  });

});