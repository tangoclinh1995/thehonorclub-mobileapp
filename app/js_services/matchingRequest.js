angular.module("thehonorclub")
.factory("$matchingRequest", function($q) {
  var dbRefJoinTeam = firebase.database().ref().child("jointeam_request");
  var dbRefInviteMember = firebase.database().ref().child("invitemember_request");



  function joinTeamRequest(from_user_uid, to_team_uid) {
    var defer = $q.defer();
    
    // This is used to check if a similar Team-Joining Request has already been issue
    var queryExist =
      dbRefJoinTeam
      .equalTo(from_user_uid, "from_user_uid")
      .equalTo(to_team_uid, "to_team_uid")
      .limitToFirst(1);

    // This is used to check if a Member-Invitation Request (with similar team uid, user uid)
    // has already been issue
    // If there is, then IT'S A MATCH
    var reverseQueryExist =
      dbRefInviteMember
      .equalTo(to_team_uid, "from_team_uid")
      .equalTo(from_user_uid, "to_member_uid")
      .limitToFirst(1);

    queryExist.once("value")
    .then(function(dataSnapshot) {
      // A similar request has already been issue, no need to send more request
      // Also, this request has not been matched yet, so resolve the promise with False
      if (dataSnapshot.numChildren() != 0) {
        defer.resolve(false);
        return;
      }

      // Now check whether a reverse request has already exist
      // (find if THERE IS A MATCH)
      // Chain this to NEXT THEN
      return reverseQueryExist.once("value")

    })
    .then(function(dataSnapshot) {
      // IT'S A MATCH
      if (dataSnapshot.numChildren() != 0) {
        defer.resolve(true);
        return;
      };

      // Otherwise, add a new Team-Joining request
      // Chain this to NEXT THEN
      return dbRefJoinTeam.push({
        from_user_uid: from_user_uid,
        to_team_uid: to_team_uid
      });

    })
    .then(function() {
      defer.resolve(false);
      
    })
    .catch(function() {
      defer.reject();
    });

    return defer.promise;
  };



  // This is the service
  return {
    joinTeam: joinTeamRequest,
    inviteMember: inviteMemberRequest,
    acceptMatch: acceptMatch
  };

});