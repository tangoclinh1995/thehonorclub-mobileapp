angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state("dashboard", {
    url: "/dashboard",
    templateUrl: "templates/dashboard.html",
    controller: "dashboardController"
  });

});