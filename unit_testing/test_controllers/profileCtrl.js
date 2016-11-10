angular.module("thehonorclub")
.controller("ProfileCtrl", function($scope, $firebaseObject, $ionicLoading) {
  var databaseRef = firebase.database.ref();

  var currentUser = firebase.auth().currentUser;
  var userInfo = $firebaseObject(databaseRef.child("user_info").child(currentUser.uid));

  $scope.name = userInfo.name;
  $scope.photoURL = userInfo.photoURL;

  $scope.skills = [];
  $scope.desiredPositions = [];

  $scope.isSavingProfile = false;

  userInfo.$loaded()
  .then(function() {
    for (i in userInfo.skills) {
      $scope.skills.push(userInfo.skills[i]);
    }

    for (i in userInfo.desired_positions) {
      $scope.desiredPositions.push(i);
    }

  });

  $scope.addSkill = function(newSkill) {
    if ($scope.skills.indexOf(newSkill) == -1) {
      $scope.skills.push(newSkill);
    }

  };

  $scope.removeSkill = function(oldSkill) {
    var arrayPos = $scope.skills.indexOf(oldSkill);

    if (arrayPos != -1) {
      $scope.skills.splice(arrayPos, 1);
    }

  };

  $scope.addPosition = function(newPosition) {
    if ($scope.positions.indexOf(newPosition) == -1) {
      $scope.positions.push(newPosition);
    }

  };

  $scope.removePosition = function(oldPosition) {
    var arrayPos = $scope.positions.indexOf(oldPosition);

    if (arrayPos != -1) {
      $scope.positions.splice(arrayPos, 1);
    }

  };  

  $scope.saveProfile = function() {
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
        duration: 1500
      });

    })
    .catch(function() {
      $scope.isSavingProfile = false;

      $ionicLoading.show({
        template: "Error saving profile!",
        duration: 1500
      });

    });

  };

});