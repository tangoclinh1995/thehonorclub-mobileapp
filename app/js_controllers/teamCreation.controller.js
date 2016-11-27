angular.module("thehonorclub") 
.controller('TeamCreationCtrl', function($scope, $firebaseObject, $firebaseAuthInstance, $ionicLoading, $tagStandardizeHelper, $stateParams, $state) {

  var databaseRef = firebase.database().ref();

  var currentUser = $firebaseAuthInstance.$getAuth();
  var userInfo = $firebaseObject(databaseRef.child("user_info").child(currentUser.uid));

  var maxMemberPerTeam = null;

  databaseRef.child("event").child($stateParams.eventUid).once("value")
  .then(function(snapshot) {
    if (!snapshot.exists()) {
      return;
    }

    if (!snapshot.child("max_member_per_team").exists()) {
      return;
    }

    maxMemberPerTeam = snapshot.child("max_member_per_team").val();
  });

  $scope.isSavingTeam = false;

  $scope.teamProfile = {
    name: "",
    description: "",

    newSkill: "",
    newPosition: "",

    skills: {},
    positions: {}
  };
  
  $scope.addSkill = function() {
    console.log($scope.teamProfile.newSkill);

    $scope.teamProfile.newSkill = $tagStandardizeHelper($scope.teamProfile.newSkill);

    if ($scope.teamProfile.newSkill == "") {
      return;
    }

    // Check if current user has the skill tag added
    if (ArrayLikeObjectContain(userInfo.skills, $scope.teamProfile.newSkill)) {
      $scope.teamProfile.skills[$scope.teamProfile.newSkill] = 1;
    } else {
      $scope.teamProfile.skills[$scope.teamProfile.newSkill] = 0;  
    }
    $scope.teamProfile.newSkill = '';
  };

  $scope.removeSkill = function(skill) {
    delete $scope.teamProfile.skills[skill];
  };


  $scope.addPosition = function() {
    $scope.teamProfile.newPosition = $tagStandardizeHelper($scope.teamProfile.newPosition);

    if ($scope.teamProfile.newPosition == "") {
      return;
    }    

    // Check if current user has the skill tag added
    if (ArrayLikeObjectContain(userInfo.desired_positions, $scope.teamProfile.newPosition)) {
      $scope.teamProfile.positions[$scope.teamProfile.newPosition] = 1;
    } else {
      $scope.teamProfile.positions[$scope.teamProfile.newPosition] = 0;  
    }

    $scope.teamProfile.newPosition = '';
  };

  $scope.removePosition = function(position) {
    delete $scope.teamProfile.positions[position];
  };

  $scope.addTeam = function() {
     $scope.isSavingTeam = true;

    if (maxMemberPerTeam == null) {
      $ionicLoading.show({
        template: "Error getting some event data!",
        duration: 1000
      });

       $scope.isSavingTeam = false;

      return;
    }

    // Save new team object in database
    var newTeamRef = firebase.database().ref().child("team").push();
    newTeamRef.set({
      event_uid: $stateParams.eventUid,

      name: $scope.teamProfile.name,
      description: $scope.teamProfile.description,

      skills_needed: $scope.teamProfile.skills,
      positions_needed: $scope.teamProfile.positions,

      leader_uid: currentUser.uid,
      members_uid: [],

      current_size: 1,
      can_add_more: maxMemberPerTeam - 1
    })
    .then(function() {
       $scope.isSavingTeam = false;

      $ionicLoading.show({
        template: "New team created!",
        duration: 1000
      })
      .then(function() {
        var newLeaderOfObj = {}
        newLeaderOfObj[newTeamRef.key] = 1;

        // Add this team to userInfo object
        databaseRef.child("user_info")
        .child(currentUser.uid)
        .child("leader_of")
        .update(newLeaderOfObj);
        
        // Move to dashboard after new team is created
        // This can be changed later
        $state.go("dashboard");

      });

    })
    .catch(function() {
       $scope.isSavingTeam = false;

      $ionicLoading.show({
        template: "Error creating new team!",
        duration: 1000
      });

    });

  };

  function ArrayLikeObjectContain(arr, el) {
    for (prop in arr) {
      if (arr[prop] == el) {
        return true;
      }

    }

    return false;
  }

});