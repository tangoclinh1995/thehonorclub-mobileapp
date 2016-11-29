angular.module('thehonorclub').directive('noScroll', function() {
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
  'matchToTeamController',
  ["$scope", "$stateParams", "TDCardDelegate", "$firebaseAuthInstance", "$matchingRequestService", "$recommendationService", "$firebaseObject", "$ionicLoading",
  function($scope, $stateParams, TDCardDelegate, $firebaseAuthInstance, $matchingRequestService, $recommendationService, $firebaseObject, $ionicLoading)
{
  var databaseRef = firebase.database().ref();

  var allUserInfo = $firebaseObject(databaseRef.child("user_info"));
  var teamInfo = $firebaseObject(databaseRef.child("team"));
  
  var currentUser = $firebaseAuthInstance.$getAuth();
  if (typeof currentUser == "undefined") {
      $state.go("login");
  }

  $scope.currentEventUid = $stateParams.eventUid;
  if ($scope.currentEventUid == "") {
    $scope.currentEventUid = undefined;    
  }
  
  $scope.eventInfo = $firebaseObject(databaseRef.child("event"));

  $scope.cards = [];

  $scope.getMoreCards = function() {
    $recommendationService.recommendTeam(currentUser.uid, $scope.currentEventUid)
    .then(function(teams) {
      var teamMatchObj;

      for (var i = 0, len = teams.length; i < len; ++i) {
        teamMatchObj = teams[i];

        $scope.cards.unshift({
          teamUid: teamMatchObj.team_uid,
          eventUid: teamMatchObj.event_uid,
          
          matchingScore: teamMatchObj.matching_score,
          mostMatchedSkills: teamMatchObj.most_matched_skills,
          mostMatchedPositions: teamMatchObj.most_matched_positions,

          image: allUserInfo[teamInfo[teamMatchObj.team_uid].leader_uid].photoURL,
          teamName: teamInfo[teamMatchObj.team_uid].name
        });
      }

    });

  };  

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
    
    if ($scope.cards.length <= 1) {
      $scope.getMoreCards();
    }

  };

  $scope.cardPartialSwipe = function(amt, index) {
  };

  $scope.cardSwipedLeft = function(index) {
    console.log("left" + index);
  };

  $scope.cardSwipedRight = function(index) {
    console.log("right" + index);

    // Send request
    var matchObj = $scope.cards[index];

    $matchingRequestService
    .joinTeam(currentUser.uid, matchObj.teamUid, matchObj.eventUid)
    .then(function(matchingResult) {
      console.log("Sent to ", matchObj.teamUid);

      // A match is found
      if (matchingResult == $matchingRequestService.REQUEST_MATCH) {
        $matchingRequestService
        .acceptMatch(matchObj.teamUid, currentUser.uid, matchObj.eventUid)
        .then(function() {
              var matchingMsg = "It's a match: You <-> " + teamInfo[matchObj.teamUid].name + "!";

              $ionicLoading.show({
                template: matchingMsg,
                duration: 1000
              });

        });

      }      

    });

  };

  $scope.swipeLeft = function(index) {
    var i = TDCardDelegate.$getByHandle('friends').cardInstances[index].el.className[5];
    console.log(i);
    var j = TDCardDelegate.$getByHandle('friends').cardInstances.length-1;
    if (index != i) {
      console.log(j);
      while (j >= 0) {
        i = TDCardDelegate.$getByHandle('friends').cardInstances[j].el.className[5];
        if (i === 0) {
          break;
        }
        --j;
      }
    }
    if(!TDCardDelegate.$getByHandle('friends').cardInstances[j]) {
      j += 1;
      console.log("undefined");
    }

    $scope.isAnimating = true;
    TDCardDelegate.$getByHandle('friends').cardInstances[j].swipe('left').then(function() {
      $scope.isAnimating = false;
      $scope.cardSwipedLeft(j);
    });
  };

  $scope.swipeRight = function(index) {
    var i = TDCardDelegate.$getByHandle('friends').cardInstances[index].el.className[5];
    console.log(i);
    var j = TDCardDelegate.$getByHandle('friends').cardInstances.length-1;
    if (index != i) {
      console.log(j);
      while (j >= 0) {
        i = TDCardDelegate.$getByHandle('friends').cardInstances[j].el.className[5];
        if (i === 0) {
          break;
        }
        --j;
      }
    }
    if(!TDCardDelegate.$getByHandle('friends').cardInstances[j]) {
      j += 1;
      console.log("undefined");
    }

    $scope.isAnimating = true;
    TDCardDelegate.$getByHandle('friends').cardInstances[j].swipe('right').then(function() {
      $scope.isAnimating = false;
      $scope.cardSwipedRight(j);
    });
  };

  $scope.yesClick = function(index) {
    console.log(index);
    $scope.swipeRight(index);
  };
  
  $scope.noClick = function(index) {
    console.log(index);
    $scope.swipeLeft(index);
  };

  setTimeout(function() {
    $scope.getMoreCards();
  }, 1000);

}

]);
