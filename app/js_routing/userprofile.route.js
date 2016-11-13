angular.module("thehonorclub")
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state("userprofile", {
    url: "/userprofile",
    templateUrl: "templates/profilepage.html",
    controller: "userProfileController"
  });

});