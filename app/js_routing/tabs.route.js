angular.module('thehonorclub')

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('tabs', {
    url: '/tabs',
    templateUrl: 'templates/tabs.html',
    abstract:true
  })

  .state('tabs.dashboard', {
    url: '/dashboard',
    views: {
      'tab1': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardController'
      }
    }
  })

  .state('tabs.cards', {
    url: '/cards',
    views: {
      'tab2': {
        templateUrl: 'templates/cardpage.html',
        controller: 'CardsController'
      }
    }
  })

  .state('tabs.matchings', {
    url: '/matchings',
    views: {
      'tab3': {
        templateUrl: 'templates/matchings.html',
        controller: 'matchingsController'
      }
    }
  })

});