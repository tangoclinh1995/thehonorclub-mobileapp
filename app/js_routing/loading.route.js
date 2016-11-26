angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state("loading", {
    url: "/loading/{origin}",
    templateUrl: "templates/loading.html",
    controller: "loadingController"
  });

});