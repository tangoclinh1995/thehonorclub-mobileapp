angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('teamCreation', {
    url: '/teamCreation/:eventUid',
    templateUrl: 'templates/team_creation_form.html',
    controller: 'TeamCreationCtrl'
  });

});