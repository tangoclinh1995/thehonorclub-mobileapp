angular.module("thehonorclub")
.controller(
  "userProfileController",
  ["$scope", "$firebaseObject", "$firebaseAuthInstance", "$tagStandardizeHelper", "$ionicLoading", "$state",
  function($scope, $firebaseObject, $firebaseAuthInstance, $tagStandardizeHelper, $ionicLoading, $state)
{
  var databaseRef = firebase.database().ref();

  var currentUser = $firebaseAuthInstance.$getAuth();
  console.log(currentUser);
  if (currentUser == undefined) {
      console.log(currentUser);
      $state.go('login');
  }
  var userInfo = $firebaseObject(databaseRef.child("user_info").child(currentUser.uid));

  $scope.skills = [];
  $scope.desiredPositions = [];

  $scope.profile = {
    name: "",
    bio: "",
    newSkill: "",
    newPosition: ""
  };

  $scope.isSavingProfile = false;

  userInfo.$loaded()
  .then(function() {
    $scope.profile.name = userInfo.name;
    $scope.photoURL = userInfo.photoURL;
    $scope.profile.bio = userInfo.bio;

    for (i in userInfo.skills) {   
      $scope.skills.push(userInfo.skills[i]);
    }

    for (i in userInfo.desired_positions) {
      $scope.desiredPositions.push(userInfo.desired_positions[i]);
    }

  });

  $scope.addSkill = function(skill) {
    skill = $tagStandardizeHelper(skill);

    if (skill != "" && $scope.skills.indexOf(skill) == -1) {
      $scope.skills.push(skill);
    }

    $scope.profile.newSkill = "";
  };

  $scope.removeSkill = function(skill) {
    var arrayPos = $scope.skills.indexOf(skill);

    if (arrayPos != -1) {
      $scope.skills.splice(arrayPos, 1);
    }

  };

  $scope.addPosition = function(position) {
    position = $tagStandardizeHelper(position);

    if (position != "" && $scope.desiredPositions.indexOf(position) == -1) {
      $scope.desiredPositions.push(position);
    }

    $scope.profile.newPosition = "";
  };

  $scope.removePosition = function(oldPosition) {
    var arrayPos = $scope.desiredPositions.indexOf(oldPosition);

    if (arrayPos != -1) {
      $scope.desiredPositions.splice(arrayPos, 1);
    }

  };  

  $scope.saveProfile = function() {
    $scope.profile.name = $scope.profile.name.trim();

    userInfo.name = $scope.profile.name;
    userInfo.bio = $scope.profile.bio;

    // NOTE:
    //    Because arrays are stored in Firebase as Object with key 0, 1, 2, ...
    //    Therefore, when we save array back to Firebase, we need to replace
    //    the old one with the whole new one
    userInfo.skills = $scope.skills;
    userInfo.desired_positions = $scope.desiredPositions;

    $scope.isSavingProfile = true;

    userInfo.$save()
    .then(function() {
      $scope.isSavingProfile = false;

      $ionicLoading.show({
        template: "Profile saved!",
        duration: 1000
      })
      .then(function(){
        setTimeout(function(){
          $state.go('dashboard');
        }, 1000);
      });

    })
    .catch(function(error) {
      $scope.isSavingProfile = false;

      $ionicLoading.show({
        template: "Error saving profile!",
        duration: 1000
      });

    });

  };

}]);