angular.module("thehonorclub") 
.controller('TeamCreationCtrl', function($scope, $firebaseObject, $firebaseAuthInstance, $ionicLoading, eventInstance) {

  var databaseRef = firebase.database().ref();

  var currentUser = $firebaseAuthInstance.$getAuth();
  //var userInfo = $firebaseObject(databaseRef.child("user_info").child(currentUser.uid));

  $scope.skills = [];
  $scope.positions = [];
  
  $scope.addSkill = function() {
    $scope.skills.push($scope.newSkill);
    $scope.newSkill = '';
  };

  $scope.addPosition = function() {
    $scope.positions[$scope.newPosition] = $scope.no;

    $scope.newPosition = '';
    $scope.no = 1;
  };

  $scope.addTeam = function() {

    var newEventRef = firebase.database().ref().child("team").push();
    newEventRef.set({
      event_uid: eventInstance.getEvent(),
      name: $scope.name,
      description: $scope.description,
      skills_needed: $scope.skills,
      positions_needed: $scope.positions,
      leader_uid: currentUser.uid,
      members_uid: [],
      current_size: 1
    });

  };
});