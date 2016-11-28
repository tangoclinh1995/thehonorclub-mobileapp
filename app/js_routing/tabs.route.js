angular.module('thehonorclub')

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('tabs', {
    url: '/tabs',
    templateUrl: 'templates/tabs.html',
    controller: "tabsController",
    abstract: true
  })

  .state("tabs.userprofile", {
    url: "/userprofile",
    views: {
      'tab1': {
        templateUrl: "templates/profilepage.html",
        controller: "userProfileController"
      }
    }
  })

  .state('tabs.dashboard', {
    url: '/dashboard',
    views: {
      'tab2': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardController'
      }
    }
  })

  .state('tabs.eventlist', {
    url: '/eventList',
    views: {
      'tab2': {
        templateUrl: 'templates/eventList.html',
        controller: 'eventListController'
      }
    }
  })

  .state('tabs.eventInfo', {
    url: '/eventInfo/:eventUid',
    views: {
      'tab2': {
        templateUrl: 'templates/eventInfo.html',
        controller: 'EventInfoCtrl'
      }
    }
  })  

  .state('tabs.teamCreation', {
    url: '/teamCreation/:eventUid',
    views: {
      'tab2': {
        templateUrl: 'templates/team_creation_form.html',
        controller: 'TeamCreationCtrl'
      }
    }
  })  

  .state('tabs.cards', {
    url: '/cards',
    views: {
      'tab3': {
        templateUrl: 'templates/cardpage.html',
        controller: 'CardsController'
      }
    }
  })

  .state('tabs.matchtoteam', {
    url: '/matchtoteam/:eventUid?',
    views: {
      'tab3': {
        templateUrl: 'templates/matchToTeam.html',
        controller: 'matchToTeamController'
      }
    }
  })

  .state('tabs.matchtoteammember', {
    url: '/matchtoteammember/:teamUid',
    views: {
      'tab3': {
        templateUrl: 'templates/matchToTeamMember.html',
        controller: 'matchToTeamMemberController'
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