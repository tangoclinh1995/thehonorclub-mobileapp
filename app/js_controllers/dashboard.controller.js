angular.module("thehonorclub")
.controller(
  "dashboardController",
  function($scope, $firebaseObject, $firebaseAuthInstance, $tagStandardizeHelper, $ionicLoading)
{
  var databaseRef = firebase.database().ref();

  var currentUser = $firebaseAuthInstance.$getAuth();
  console.log(currentUser);
  if (currentUser == undefined) {
      console.log(currentUser);
      $state.go('login');
  }
  $scope.userInfo = $firebaseObject(databaseRef.child("user_info").child(currentUser.uid));
  $scope.allUserInfo = $firebaseObject(databaseRef.child("user_info"));
  $scope.eventInfo = $firebaseObject(databaseRef.child("event"));
  $scope.teamInfo = $firebaseObject(databaseRef.child("team"));   

  console.log($scope);

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
