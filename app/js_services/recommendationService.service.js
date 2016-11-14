angular.module("thehonorclub")
.factory("$recommendationService", function($q, $matchingCalculationHelper) {
  var db = firebase.database().ref();
  
  var dbRefTeam = db.child("team");
  var dbRefUserInfo = db.child("user_info");
  var dbRefUserHaveTeam = db.child("user_have_team");

  var dbRefJoinTeam = db.child("jointeam_request");
  var dbRefInviteMember = db.child("invitemember_request");



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


  function getPendingJoinTeamRequest(userUid) {
    var result = {};

    dbRefJoinTeam
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
    var availTeams;

    dbRefUserInfo.once("value")
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

    function getRecommendList() {

    };

    return defer.promise;
  }


  function recommendMember(team_uid) {

  }


  return {
    recommendTeam: recommendTeam,
    recommendMember: recommendMember
  }; 

});