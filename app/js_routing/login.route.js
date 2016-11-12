angular.module('thehonorclub')
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/landing.html',
    controller: 'loginController'
  });

});