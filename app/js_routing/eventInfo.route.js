angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('eventInfo', {
    url: '/eventInfo/:eventUid',
    templateUrl: 'templates/eventInfo.html',
    controller: "EventInfoCtrl"
  });

});