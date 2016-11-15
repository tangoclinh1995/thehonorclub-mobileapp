angular.module("thehonorclub") 
.controller('TeamCreationCtrl', function($scope, $firebaseObject, $firebaseAuthInstance, $ionicLoading, $tagStandardizeHelper, $state) {

  var databaseRef = firebase.database().ref();

  var currentUser = $firebaseAuthInstance.$getAuth();
  //var userInfo = $firebaseObject(databaseRef.child("user_info").child(currentUser.uid));

  $scope.skills = [];
  $scope.positions = {'leader': 1};
  
  $scope.addSkill = function() {
    $scope.skills.push($tagStandardizeHelper($scope.newSkill));
    $scope.newSkill = '';
  };

  $scope.removeSkill = function($index) {
    $scope.skills.splice($index, 1);
  };


  $scope.addPosition = function() {
    $scope.positions[$scope.newPosition] = $scope.no;

    $scope.newPosition = '';
    $scope.no = 1;
  };

  $scope.removePosition = function(position) {
    delete $scope.positions[position];
  };

  $scope.addTeam = function() {

    var newTeamRef = firebase.database().ref().child("team").push();
    newTeamRef.set({
      event_uid: $state.event_uid,
      name: $scope.name,
      description: $scope.description,
      skills_needed: $scope.skills,
      positions_needed: $scope.positions,
      leader_uid: currentUser.uid,
      members_uid: [],
      current_size: 1,
      can_add_more: $state.max_member_per_team - 1
    });

  };
});