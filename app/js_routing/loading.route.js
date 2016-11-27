angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state("loading", {
    url: "/loading",
    templateUrl: "templates/loading.html",
    controller: "loadingController"
  });

});