angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('evmtRequest', {
    url: '/evmtRequest',
    templateUrl: 'templates/evmt_form.html'
  });

});