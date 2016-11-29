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
  'matchToTeamMemberController',
  ["$scope", "$stateParams", "$ionicLoading", "TDCardDelegate", "$firebaseAuthInstance", "$matchingRequestService", "$recommendationService", "$firebaseObject",
  function($scope, $stateParams, $ionicLoading, TDCardDelegate, $firebaseAuthInstance, $matchingRequestService, $recommendationService, $firebaseObject)
{
  var currentUser = $firebaseAuthInstance.$getAuth();
  if (typeof currentUser == "undefined") {
      $state.go("login");
  }

  var databaseRef = firebase.database().ref();

  var allUserInfo = $firebaseObject(databaseRef.child("user_info"));
  
  $scope.currentTeamInfo = $firebaseObject(databaseRef.child("team").child($stateParams.teamUid));

  $scope.currentTeamInfo.$loaded().then(function() {
    $scope.currentEventUid = $scope.currentTeamInfo.event_uid;
    $scope.currentEvent = $firebaseObject(databaseRef.child("event").child($scope.currentEventUid));
  });

  $scope.cards = [];

  $scope.getMoreCards = function() {
    $recommendationService.recommendMember($stateParams.teamUid)
    .then(function(members) {
      var memberMatchObj;

      for (var i = 0, len = members.length; i < len; ++i) {
        memberMatchObj = members[i];

        $scope.cards.unshift({
          memberUid: memberMatchObj.member_uid,
          
          matchingScore: memberMatchObj.matching_score,
          mostMatchedSkills: memberMatchObj.most_matched_skills,
          mostMatchedPositions: memberMatchObj.most_matched_positions,

          image: allUserInfo[memberMatchObj.member_uid].photoURL,
          memberName: allUserInfo[memberMatchObj.member_uid].name
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

  $scope.cardPartialSwipe = function(amt) {
    // console.log(amt);
  };

  $scope.cardSwipedLeft = function(index) {
    console.log("Left" + index);
  };

  $scope.cardSwipedRight = function(index) {
    console.log("Right" + index);

    // Send request
    var matchObj = $scope.cards[index];

    $matchingRequestService
    .inviteMember($stateParams.teamUid, matchObj.memberUid, $scope.currentEventUid)
    .then(function(matchingResult) {
      console.log("Sent to ", matchObj.memberUid);

      // A match is found
      if (matchingResult == $matchingRequestService.REQUEST_MATCH) {
        $matchingRequestService
        .acceptMatch($stateParams.teamUid, matchObj.memberUid, $scope.currentEventUid)
        .then(function() {
          var matchingMsg =
            "It's a match: " +
            $scope.currentTeamInfo.name +
            " <-> " +
            allUserInfo[matchObj.memberUid].name + 
            "!";  

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
