angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state("cards", {
    url: "/cards",
    templateUrl: "templates/cardpage.html",
    controller: "CardsController"
  });

});