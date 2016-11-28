angular.module("thehonorclub")
.factory("$matchingRequestService", function($q, $timeoutFirebaseOnceQuery) {
  var REQUEST_MATCH = 1;
  var REQUEST_NOMATCH = 2;
  var REQUEST_INVALID = 3;



  var db = firebase.database().ref();

  var dbRefJoinTeam = db.child("jointeam_request");
  var dbRefInviteMember = db.child("invitemember_request");  
  var dbRefTeam = db.child("team");
  var dbRefUserHaveTeam = db.child("user_have_team");  



  function userHaveTeam(userUid, eventUid) {
    var defer = $q.defer();

    $timeoutFirebaseOnceQuery(
      dbRefUserHaveTeam.child(eventUid).child(userUid),
      "value"
    )    
    .then(function(snapshot) {

      if (snapshot.exists()) {
        defer.resolve(true);        
      } else {
        defer.resolve(false);
      }

    })
    .catch(defer.reject);

    return defer.promise;
  }



  function teamIsFull(teamUid) {
    var defer = $q.defer();

    dbRefTeam.child(teamUid).child("can_add_more")
    .once("value")
    .then(function(snapshot) {

      if (snapshot.val() == 0) {
        defer.resolve(true);
      } else {
        defer.resolve(false);
      }

    })
    .catch(defer.reject);    

    return defer.promise;
  }


  
  function requestObjKey(uidX, uidY) {
    return uidX + " => " + uidY;
  }



  function joinTeamRequest(fromUserUid, toTeamUid, eventUid) {
    var defer = $q.defer();
    
    var joinTeamObjKey = requestObjKey(fromUserUid, toTeamUid),
        inviteMemberObjKey = requestObjKey(toTeamUid, fromUserUid);
    
    // This is used to check if a similar Team-Joining Request has already been issued
    var queryExist = dbRefJoinTeam.child(joinTeamObjKey);

    // This is used to check if a Member-Invitation Request (with similar team uid, user uid)
    // has already been issue
    // If there is, then IT'S A MATCH
    var reverseQueryExist = dbRefInviteMember.child(inviteMemberObjKey);
    
    // Check whether user has already had a team
    userHaveTeam(fromUserUid, eventUid)
    .then(function(hasTeam) {

      // If he/she already has a team, then cannot perform this request
      if (hasTeam) {
        defer.resolve(REQUEST_INVALID);
        return;
      }

      // Otherwise, check whether the request team is already full
      // Chain this to NEXT THEN
      return teamIsFull(toTeamUid);

    })
    .then(function(fullTeam) {
      // If team is already full, then cannot perform this request
      if (fullTeam) {
        defer.resolve(REQUEST_INVALID);
        return;
      }

      // Otherwise, check whether reverse request exists
      // Chain this to NEXT THEN
      return reverseQueryExist.once("value")

    })
    .then(function(snapshot) {
      // Add this based on unit testing behavior
      if (!snapshot) {
        return;
      }

      // A reverse request exists, meaning that IT'S A MATCH
      if (snapshot.exists()) {
        defer.resolve(REQUEST_MATCH);
        return;
      }

      // Otherwise, check whether similar Team-Joing Request has already been issued
      // Chain this to NEXT THEN
      return queryExist.once("value");

    })
    .then(function(snapshot) {
      // Add this based on unit testing behavior
      if (!snapshot) {
        return;
      }

      // The similar request exists, no need to add a new request
      if (snapshot.exists()) {
        defer.resolve(REQUEST_NOMATCH);
        return;
      };

      // Otherwise, add a new Team-Joining request
      // Chain this to NEXT THEN
      return dbRefJoinTeam.child(joinTeamObjKey).set({
        from_user_uid: fromUserUid,
        to_team_uid: toTeamUid,
        event_uid: eventUid
      });

    })
    .then(function() {

      defer.resolve(REQUEST_NOMATCH);
      
    })
    .catch(function() {

      defer.reject();

    });

    return defer.promise;
  };



  // This function is just an opposite of joinTeamRequest function
  function inviteMemberRequest(fromTeamUid, toMemberUid, eventUid) {
    var defer = $q.defer();

    var inviteMemberObjKey = requestObjKey(fromTeamUid, toMemberUid),
        joinTeamObjKey = requestObjKey(toMemberUid, fromTeamUid);
    
    var queryExist = dbRefInviteMember.child(inviteMemberObjKey);

    var reverseQueryExist = dbRefJoinTeam.child(joinTeamObjKey);

    userHaveTeam(toMemberUid, eventUid)
    .then(function(hasTeam) {

      if (hasTeam) {
        defer.resolve(REQUEST_INVALID);
        return;
      }

      return teamIsFull(fromTeamUid);

    })
    .then(function(fullTeam) {

      if (fullTeam) {
        defer.resolve(REQUEST_INVALID);
        return;
      }

      return reverseQueryExist.once("value") 

    })
    .then(function(snapshot) {
      // Add this based on unit testing behavior
      if (!snapshot) {
        return;
      }      

      // IT'S A MATCH
      if (snapshot.exists()) {
        defer.resolve(REQUEST_MATCH);
        return;
      }

      return queryExist.once("value");

    })
    .then(function(snapshot) {
      // Based on unit-testing behavior
      if (!snapshot) {
        return;
      }

      if (snapshot.exists()) {
        defer.resolve(REQUEST_NOMATCH);
        return;
      };

      // Otherwise, add a new Member-Invitation request
      // Chain this to NEXT THEN
      return dbRefInviteMember.child(inviteMemberObjKey).set({
        from_team_uid: fromTeamUid,
        to_member_uid: toMemberUid,
        event_uid: eventUid
      });

    })
    .then(function() {

      defer.resolve(REQUEST_NOMATCH);
      
    })
    .catch(function() {
      
      defer.reject();
    });

    return defer.promise;
  };



  // Process the success matching between team & member
  function acceptMatch(teamUid, userUid, eventUid) {
    var defer = $q.defer();

    var jobRemaining = 6;
    function done() {
      --jobRemaining;
      
      if (jobRemaining == 0) {
        defer.resolve();
      };

    };

    function deleteObjectInSnapshotAndNotify(conditionalKey, conditionalValue) {
      var needComparison = typeof conditionalKey == "string" && typeof conditionalValue != "undefined";

      return function(snapshot) {
        snapshot.forEach(function(snapshotChild) {
          if (
            !needComparison ||
            (needComparison && snapshotChild.child(conditionalKey).val() == conditionalValue)
          ) {
            snapshotChild.ref.remove();  
          }
          
        });

        done();
      }

    }

    // Delete all Team-Joining request of the user in the event
    $timeoutFirebaseOnceQuery(
      dbRefJoinTeam.orderByChild("from_user_uid").equalTo(userUid),
      "value"
    )
    .then(deleteObjectInSnapshotAndNotify("event_uid", eventUid))
    .catch(defer.reject);

    // Delete all Member-Inviting request relating to the user in the event
    $timeoutFirebaseOnceQuery(
      dbRefInviteMember.orderByChild("to_member_uid").equalTo(userUid),
      "value"
    )
    .then(deleteObjectInSnapshotAndNotify("event_uid", eventUid))
    .catch(defer.reject);

    // Delete Member-Inviting Request of the team to the user
    $timeoutFirebaseOnceQuery(
      dbRefInviteMember.orderByChild("from_team_uid").equalTo(teamUid),
      "value"
    )
    .then(deleteObjectInSnapshotAndNotify("to_member_uid", userUid))
    .catch(defer.reject);

    var removeAllTeamMemberInviteRequest = false;

    // Add team to user
    db.child("user_info").child(userUid).child("member_of").child(teamUid)
    .set(1)
    .then(done)
    .catch(defer.reject);

    var userSkills, userDesiredPosition;    

    // Add user to team
    db.child("user_info").child(userUid)
    .once("value")
    .then(function(userInfoSnapshot) {

      userSkills = userInfoSnapshot.child("skills");
      userDesiredPosition = userInfoSnapshot.child("desired_positions");      

      dbRefTeam.child(teamUid).child("members_uid").child(userUid).set(1);

      return dbRefTeam.child(teamUid).once("value")

    })
    .then(function(teamSnapshot) {
      // Add user skill to team skills_needed
      var teamSkillsNeeded = teamSnapshot.child("skills_needed").val();    

      for (sk in teamSkillsNeeded) {
        if (userSkills.hasChild(sk)) {
          teamSkillsNeeded[sk] += 1;
        }

      }

      // Add user position to team_positions_needed
      var teamPositionsNeeded = teamSnapshot.child("positions_needed").val();

      for (pos in teamPositionsNeeded) {
        if (userDesiredPosition.hasChild(pos)) {
          teamPositionsNeeded[pos] += 1;
        }

      }

      var teamCurrentSize = teamSnapshot.child("current_size").val() + 1;
      var teamCanAddMore = teamSnapshot.child("can_add_more").val() - 1;

      if (teamCanAddMore == 0) {
        removeAllTeamMemberInviteRequest = true;
      }
      
      return dbRefTeam.child(teamUid).update({
        "skills_needed": teamSkillsNeeded,
        "positions_needed": teamPositionsNeeded,
        "current_size": teamCurrentSize,
        "can_add_more": teamCanAddMore
      });

    })
    .then(function() {     
      if (removeAllTeamMemberInviteRequest) {
        $timeoutFirebaseOnceQuery(
          dbRefInviteMember.orderByChild("from_team_uid").equalTo(teamUid),
          "value"          
        )
        .then(deleteObjectInSnapshotAndNotify("event_uid", eventUid))
        .catch(defer.reject);

        $timeoutFirebaseOnceQuery(
          dbRefJoinTeam.orderByChild("to_team_uid").equalTo(teamUid),
          "value"
        )
        .then(deleteObjectInSnapshotAndNotify("event_uid", eventUid))
        .catch(defer.reject);
      } else {
        done();
        done();
      }

    })
    .catch(defer.reject);    

    return defer.promise;
  };

  // This is the service
  return {
    REQUEST_MATCH: REQUEST_MATCH,
    REQUEST_NOMATCH: REQUEST_NOMATCH,
    REQUEST_INVALID: REQUEST_INVALID,

    joinTeam: joinTeamRequest,
    inviteMember: inviteMemberRequest,
    acceptMatch: acceptMatch
  };

});