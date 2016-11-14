angular.module("thehonorclub")
.factory("$recommendationService", function($q, $matchingCalculationHelper) {
  var db = firebase.database().ref();
  
  var dbRefTeam = db.child("team");
  var dbRefUserInfo = db.child("user_info");
  var dbRefUserHaveTeam = db.child("user_have_team");

  var dbRefJoinTeam = db.child("jointeam_request");
  var dbRefInviteMember = db.child("invitemember_request");


  function sortBasedOnMatchingScore(matchX, matchY) {
    return matchY.matching_score - matchX.matching_score;
  }



  // Return map of team_uid => team_object which are not full yet.
  // eventUid is an optional parameter
  function getAvailTeam(eventUid) {
    var defer = $q.defer();

    var query = dbRefTeam;

    // If eventUid is provided, filter team based on it
    if (typeof eventUid == "string") {
      query = query.equalTo("eventUid", eventUid);
    }

    // Only get un-full team, meaning that can_add_more > 1
    query = query.startAt(1, "can_add_more")

    query.once("value")
    .then(function(snapshot) {
      defer.resolve(snashot.val());      
    })
    .catch(defer.reject);

    return defer.promise;
  }



  // Return map of user_uid => userinfo_object which don't join any 
  // team yet
  // eventUid is compulsory
  function getAvailUser(eventUid) {
    var defer = $q.defer();

    var nextCount = 2;
    function next() {
      --nextCount;
      if (nextCount == 0) {
        extractUser();
      };

    }

    var mapUserHaveTeam;
    var mapUserInfo;

    dbRefUserHaveTeam.child(eventUid)
    .once("value")
    .then(function(snapshot) {
      mapUserHaveTeam = snapshot.val();
      next();      
    })
    .catch(defer.reject);

    dbRefUserInfo.once("value")
    .then(function(snapshot) {
      mapUserInfo = snapshot.val();
      next();
    })
    .catch(defer.reject);

    // Extract user whose UID is not in `user_have_team[event_uid]
    // They are available user
    function extractUser() {
      var result = {};

      for (uid in mapUserInfo) {
        if (mapUserHaveTeam[uid]) {
          result[uid] = mapUserInfo[uid];
        }

      }

      defer.resolve(result);
    }

    return defer.promise;
  }



  // Return map of team_uid => 1 which an user has sent joining request to
  function getTeamWithRequestSent(userUid) {
    var defer = $q.defer();

    dbRefJoinTeam.
    equalTo(userUid, "from_user_uid")
    .once("value")
    .then(function(snapshot) {

      var result = {};

      snapsnot.forEach(function(request) {
        result[request.child("to_team_uid").val()] = 1;
      });


      defer.resolve(result);

    })
    .catch(defer.reject);

    return defer.promise;
  }



  // Return map of user_uid => 1 which a team has sent invitiation request to
  function getUserWithRequestSent(teamUid) {
    var defer = $q.defer();

    dbRefInviteMember
    .equalTo(teamUid, "from_team_uid")
    .once("value")
    .then(function(snapshot) {

      var result = {};

      snapsnot.forEach(function(request) {
        result[request.child("to_member_uid").val()] = 1;
      });


      defer.resolve(result);

    })
    .catch(defer.reject);

    return defer.promise;
  }



  function recommendTeam(userUid, eventUid) {
    var defer = $q.defer();

    var nextCount = 3;
    function next() {
      --nextCount;
      if (nextCount == 0) {
        getRecommendList();
      };

    };

    var userInfo;
    var availTeams, teamsWithRequestSent;

    dbRefUserInfo.child(userUid)
    once("value")
    .then(function(snapshot) {
      userInfo = snapshot.val();
      next();
    })
    .catch(defer.reject);

    getAvailTeam(eventUid)
    .then(function(teams) {
      availTeams = teams;
      next();
    })
    .catch(defer.reject);

    getTeamWithRequestSent(userUid)
    .then(function(teams) {
      teamsWithRequestSent = teams;
      next();
    })
    .catch(defer.reject);

    function getRecommendList() {
      var result = [];

      for (teamUid in availTeams) {
        // Ignore team which user has sent joining request
        if (teamsWithRequestSent[teamUid]) {
          continue;
        }

        var team = availTeams[teamUid];

        result.push($matchingCalculationHelper(userInfo, team));
      }

      result.sort(sortBasedOnMatchingScore);

      defer.resolve(result);
    };

    return defer.promise;
  }


  function recommendMember(teamUid) {
    var defer = $q.defer();

    var nextCount = 3;
    function next() {
      --nextCount;
      if (nextCount == 0) {
        getRecommendList();
      };

    };

    var team;
    var availUsers, userWithRequestSent;

    dbRefTeam.child(teamUid)
    once("value")
    .then(function(snapshot) {
      team = snapshot.val();
      next();
    })
    .catch(defer.reject);

    getAvailUser(eventUid)
    .then(function(users) {
      availUsers = users;
      next();
    })
    .catch(defer.reject);

    getUserWithRequestSent(teamUid)
    .then(function(users) {
      userWithRequestSent = users;
      next();
    })
    .catch(defer.reject);

    function getRecommendList() {
      var result = [];

      for (userUid in availUsers) {
        // Ignore team which user has sent joining request
        if (userWithRequestSent[userUid]) {
          continue;
        }

        var user = availUsers[userUid];

        result.push($matchingCalculationHelper(user, team));
      }

      result.sort(sortBasedOnMatchingScore);

      defer.resolve(result);
    };

    return defer.promise;    
  }


  return {
    recommendTeam: recommendTeam,
    recommendMember: recommendMember
  }; 

});