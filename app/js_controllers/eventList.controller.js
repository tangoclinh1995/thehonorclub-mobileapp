angular.module("thehonorclub")
.controller("eventListController",
function($scope, $firebaseObject, $firebaseAuthInstance) {
  var databaseRef = firebase.database().ref();

  var currentUser = $firebaseAuthInstance.$getAuth();
  if (typeof currentUser == "undefined") {
      $state.go('login');
  }

  $scope.userHaveTeam = $firebaseObject(databaseRef.child("user_have_team"));
  $scope.event = $firebaseObject(databaseRef.child("event"));

  $scope.eventAvailForUser = function(eventUid) {
    var userInEvent = $scope.userHaveTeam[eventUid];
    if (typeof userInEvent == "undefined") {
      return true;
    }

    var containUser = userInEvent[currentUser.uid];
    if (typeof containUser == "undefined") {
      return true;
    }

    return containUser != 1;
  }

  $scope.unixTimestampToString = function(timestamp) {
    return moment.unix(timestamp).format("DD/MM/YYYY hh:mm");
  }

});
