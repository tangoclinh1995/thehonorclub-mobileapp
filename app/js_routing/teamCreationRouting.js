angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('teamCreation', {
    url: '/teamCreation',
    templateUrl: 'templates/team_creation_form.html'
  });

});