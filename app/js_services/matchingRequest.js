angular.module("thehonorclub")
.factory("$matchingRequest", function($q) {
  var dbRefJoinTeam = firebase.database().ref().child("jointeam_request");
  var dbRefInviteMember = firebase.database().ref().child("invitemember_request");



  function joinTeamRequest(fromUserUid, toTeamUid) {
    var defer = $q.defer();
    
    // This is used to check if a similar Team-Joining Request has already been issued
    var queryExist =
      dbRefJoinTeam
      .equalTo(fromUserUid, "from_user_uid")
      .equalTo(toTeamUid, "to_team_uid")
      .limitToFirst(1);

    // This is used to check if a Member-Invitation Request (with similar team uid, user uid)
    // has already been issue
    // If there is, then IT'S A MATCH
    var reverseQueryExist =
      dbRefInviteMember
      .equalTo(toTeamUid, "from_team_uid")
      .equalTo(fromUserUid, "to_member_uid")
      .limitToFirst(1);

    reverseQueryExist.once("value")
    .then(function(dataSnapshot) {

      // A reverse request exists, meaning that IT'S A MATCH
      if (dataSnapshot.numChildren() != 0) {
        defer.resolve(true);
        return;
      }

      // Otherwise, check whether similar Team-Joing Request has already been issued
      return queryExist.once("value");

    })
    .then(function(dataSnapshot) {

      // The similar request exists, no need to add a new request
      if (dataSnapshot.numChildren() != 0) {
        defer.resolve(false);
        return;
      };

      // Otherwise, add a new Team-Joining request
      // Chain this to NEXT THEN
      return dbRefJoinTeam.push({
        from_user_uid: fromUserUid,
        to_team_uid: toTeamUid
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



  // This function is just a reverse of joinTeamRequest function
  function inviteMember(fromTeamUid, toMemberUid) {
    var defer = $q.defer();
    
    var queryExist =
      dbRefInviteMember
      .equalTo(fromTeamUid, "from_team_uid")
      .equalTo(toMemberUid, "to_member_uid")
      .limitToFirst(1);

    var reverseQueryExist =
      dbRefJoinTeam
      .equalTo(toMemberUid, "from_user_uid")
      .equalTo(fromTeamUid, "to_team_uid")
      .limitToFirst(1);

    reverseQueryExist.once("value")
    .then(function(dataSnapshot) {

      // IT'S A MATCH
      if (dataSnapshot.numChildren() != 0) {
        defer.resolve(true);
        return;
      }

      return queryExist.once("value");

    })
    .then(function(dataSnapshot) {

      if (dataSnapshot.numChildren() != 0) {
        defer.resolve(false);
        return;
      };

      // Otherwise, add a new Member-Invitation request
      // Chain this to NEXT THEN
      return dbRefInviteMember.push({
        from_team_uid: fromTeamUid,
        to_member_uid: toMemberUid
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



  // Process the success matching between team & member
  function acceptMatch(teamUid, userUid) {
    var defer = $q.defer();

    var jobRemaining = 4;
    function done() {
      --jobRemaining;
      
      if (jobRemaining == 0) {
        defer.resolve();
      };

    };  

    // Delete Team-Joing Request
    dbRefJoinTeam
    .equalTo(userUid, "from_user_uid")
    .equalTo(teamUid, "to_team_uid")
    .once("value")
    .then(function(dataSnapshot) {

      dataSnapshot.forEach(function(child) {
        child.ref.remove();
      });

      done();

    })
    .catch(function() {
      defer.reject();
    });

    // Delete Member-Inviting Request
    dbRefInviteMember
    .equalTo(teamUid, "from_team_uid")
    .equalTo(memberUid, "to_member_uid")
    .once("value")    
    .then(function(dataSnapshot) {
      
      dataSnapshot.forEach(function(child) {
        child.ref.remove();
      });

      done();

    })
    .catch(function() {
      defer.reject();
    })

    // Add user to team
    firebase.database().ref()
    .child("team").child(teamUid).child("members_uid")
    .push(userUid)
    .then(function() {
      done();

    })
    .catch(function() {
      defer.reject();
    });

    // Add team to user
    firebase.database().ref()
    .child("user_info").child(userUid).child("member_of")
    .push(teamUid)
    .then(function() {
      done();

    })
    .catch(function() {
      defer.reject();
    });
    

    return defer.promise();
  };



  // This is the service
  return {
    joinTeam: joinTeamRequest,
    inviteMember: inviteMemberRequest,
    acceptMatch: acceptMatch
  };

});