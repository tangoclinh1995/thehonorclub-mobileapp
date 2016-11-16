angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('teamCreation', {
    url: 'teamCreation/:event_uid',
    templateUrl: 'templates/team_creation_form.html',
    controller: 'TeamCreationCtrl'
  });

});