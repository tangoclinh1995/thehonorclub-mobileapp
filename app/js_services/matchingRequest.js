angular.module("thehonorclub")
.factory("$matchingRequest", function($q) {
  var db = firebase.database().ref();

  var dbRefJoinTeam = db.child("jointeam_request");
  var dbRefInviteMember = db.child("invitemember_request");
  var dbRefTeam = db.child("team");



  function joinTeamRequest(fromUserUid, toTeamUid, eventUid) {
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

    // Check whether reverse request exists
    reverseQueryExist.once("value")
    .then(function(dataSnapshot) {

      // A reverse request exists, meaning that IT'S A MATCH
      if (dataSnapshot.numChildren() != 0) {
        defer.resolve(true);
        return;
      }

      // Otherwise, check whether similar Team-Joing Request has already been issued
      // Chain this to NEXT THEN
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
        to_team_uid: toTeamUid,
        event_uid: eventUid
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



  // This function is just an opposite of joinTeamRequest function
  function inviteMember(fromTeamUid, toMemberUid, eventUid) {
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
        to_member_uid: toMemberUid,
        event_uid: eventUid
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
  function acceptMatch(teamUid, userUid, eventUid, maxMemberPerTeam) {
    var defer = $q.defer();

    var jobRemaining = 7;
    function done() {
      --jobRemaining;
      
      if (jobRemaining == 0) {
        defer.resolve();
      };

    };

    function deleteObjectInSnapshotAndNotify(snapshot) {
      snapshot.forEach(function(child) {
        child.ref.remove();
      });

      done();
    }

    // Delete all Team-Joining request of the user in the event
    dbRefJoinTeam
    .equalTo(userUid, "from_user_uid")
    .equalTo(eventUid, "event_uid")
    .once("value")
    .then(deleteObjectInSnapshotAndNotify)
    .catch(defer.reject);

    // Delete all Member-Inviting request relating to the user in the event
    dbRefInviteMember
    .equalTo(userUid, "to_member_uid")
    .equalTo(eventUid, "event_uid")
    .once("value")
    .then(deleteObjectInSnapshotAndNotify)
    .catch(defer.reject);

    // Delete Member-Inviting Request of the team to the user
    dbRefInviteMember
    .equalTo(teamUid, "from_team_uid")
    .equalTo(memberUid, "to_member_uid")
    .once("value")    
    .then(deleteObjectInSnapshotAndNotify)
    .catch(defer.reject);

    // Add user to team
    db.child("team").child(teamUid).child("members_uid")
    .push(userUid)
    .then(done)
    .catch(defer.reject);

    // Add team to user
    db.child("user_info").child(userUid).child("member_of")
    .push(teamUid)
    .then(done)
    .catch(defer.reject);

    // Increase team size to 1
    db.child("team").child("current_size").transaction(function(currentSize) {
      currentSize += 1;

      // If team is now full, delete all relating Team-Joining & Member-Inviting
      // request relating to the team
      if (currentSize >= maxMemberPerTeam) {

        dbRefInviteMember
        .equalTo(teamUid, "from_team_uid")
        .equalTo(eventUid, "event_uid")
        .once("value")
        .then(deleteObjectInSnapshotAndNotify)
        .catch(defer.reject);

        dbRefJoinTeam
        .equalTo(teamUid, "to_team_uid")
        .equalTo(eventUid, "event_uid")
        .once("value")
        .then(deleteObjectInSnapshotAndNotify)
        .catch(defer.reject);                
        
      } else {
        done();
        done();
      }

      return currentSize;
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