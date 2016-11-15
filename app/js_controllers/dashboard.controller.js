angular.module("thehonorclub")
.controller(
  "dashboardController",
  function($scope, $firebaseObject, $firebaseAuthInstance, $tagStandardizeHelper, $ionicLoading)
{
  var databaseRef = firebase.database().ref();

  var currentUser = $firebaseAuthInstance.$getAuth();
  var userInfo = $firebaseObject(databaseRef.child("user_info").child(currentUser.uid));
  var allUserInfo = $firebaseObject(databaseRef.child("user_info"));
  var eventInfo = $firebaseObject(databaseRef.child("event"));


  $scope.toggleEvent = function(team) {
    if ($scope.isTeamShown(team)) {
      $scope.shownTeam = null;
    }
    else {
      $scope.shownTeam = team;
    }
  };

  $scope.isTeamShown = function(team) {
    return $scope.shownTeam === team;
  };


});
