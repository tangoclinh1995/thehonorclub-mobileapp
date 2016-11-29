angular.module("thehonorclub")
.factory("$recommendationService", function($q, $timeoutFirebaseOnceQuery, $matchingCalculationHelper) {
  var db = firebase.database().ref();
  
  var dbRefTeam = db.child("team");
  var dbRefUserInfo = db.child("user_info");
  var dbRefUserHaveTeam = db.child("user_have_team");

  var dbRefJoinTeam = db.child("jointeam_request");
  var dbRefInviteMember = db.child("invitemember_request");


  function sortBasedOnMatchingScore(matchX, matchY) {
    return matchY.matching_score - matchX.matching_score;
  }



  // Return map of team_uid => team_object which are not full yet and the user is NOT PART of this team
  // eventUid is an optional parameter
  function getAvailTeam(eventUid, userUid) {
    var defer = $q.defer();

    var eventUidProvided = (typeof eventUid == "string");

    // Only get un-full team, meaning that can_add_more > 1
    $timeoutFirebaseOnceQuery(
      dbRefTeam.orderByChild("can_add_more").startAt(1),
      "value"
    )
    .then(function(snapshot) {
      var result = {};

      snapshot.forEach(function(team) {
        if (eventUidProvided && team.child("event_uid").val() != eventUid) {
          return;
        }

        if (team.child("leader_uid").val() == userUid || team.child("members_uid").hasChild(userUid)) {
          return;
        }

        result[team.key] = team.val();
      });

      defer.resolve(result);      
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

    $timeoutFirebaseOnceQuery(dbRefUserHaveTeam.child(eventUid), "value")
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

    // Extract user whose UID is not in user_have_team[event_uid]
    // They are available user
    function extractUser() {
      var result = {};

      for (uid in mapUserInfo) {
        if (typeof mapUserHaveTeam[uid] == "undefined") {
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

    
    $timeoutFirebaseOnceQuery(
      dbRefJoinTeam
      .orderByChild("from_user_uid")
      .equalTo(userUid),
      "value"
    )
    .then(function(snapshot) {

      var result = {};

      snapshot.forEach(function(request) {
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

    $timeoutFirebaseOnceQuery(
      dbRefInviteMember.orderByChild("from_team_uid").equalTo(teamUid),
      "value"
    )
    .then(function(snapshot) {
      var result = {};

      snapshot.forEach(function(request) {
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
    .once("value")
    .then(function(snapshot) {
      userInfo = snapshot.val();
      next();
    })
    .catch(defer.reject);

    getAvailTeam(eventUid, userUid)
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
        var match = $matchingCalculationHelper(userInfo, team);
        match["team_uid"] = teamUid;
        match["event_uid"] = team["event_uid"];

        result.push(match);
      }

      result.sort(sortBasedOnMatchingScore);

      defer.resolve(result);
    };

    return defer.promise;
  }


  function recommendMember(teamUid) {
    var defer = $q.defer();

    var nextCount = 2;
    function next() {
      --nextCount;
      if (nextCount == 0) {
        getRecommendList();
      };

    };

    var team;
    var eventUid;
    var availUsers, userWithRequestSent;

    dbRefTeam.child(teamUid)
    .once("value")
    .then(function(snapshot) {
      
      team = snapshot.val();

      return getAvailUser(team["event_uid"])

    })
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
        
        var match = $matchingCalculationHelper(user, team);
        match["member_uid"] = userUid; 

        result.push(match);
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