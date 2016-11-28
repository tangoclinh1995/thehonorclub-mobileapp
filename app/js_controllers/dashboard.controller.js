angular.module("thehonorclub").directive('noScroll', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $element.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})
.controller(
  "dashboardController",
  function($state, $scope, $firebaseObject, $firebaseAuthInstance, $tagStandardizeHelper, $ionicLoading)
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

  $scope.logout = function() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      $firebaseAuthInstance.$cleanAuth();

      $state.go("login");

    }, function(error) {
      // An error happened.
      console.error(error);
    });
  };
  
});
