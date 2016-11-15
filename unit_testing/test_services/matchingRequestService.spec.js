describe("$matchingRequestService", function() {
  var TESTING_USER = {
    a: {
      skills: ["s1", "s2", "s3"],
      desired_positions: ["p1", "p2"]
    },
    b: {
      skills: ["s2"],
      desired_positions: ["p2", "p3"]
    },
    c: {
      skills: ["s3"],
      desired_positions: ["p1"]
    },
    d: {
      skills: ["s1", "s3"],
      desired_positions: ["p2"]
    }

  };

  var TESTING_TEAM = {
    x: {
      current_size: 1,
      can_add_more: 1,
      
      skills_needed: {
        "s1": 0,
        "s2": 3
      },

      positions_needed: {
        "p2": 1,
        "p3": 2
      }

    },
    y: {
      current_size: 1,
      can_add_more: 0,
      
      skills_needed: {
        "s3": 4,
      },

      positions_needed: {
        "p1": 1,
        "p2": 2
      }

    },
    z: {
      current_size: 1,
      can_add_more: 2,
      
      skills_needed: {
        "s2": 3,
        "s3": 1
      },

      positions_needed: {
        "p2": 1,
        "p3": 2
      }

    },        

  };

  var TESTING_USER_HAVE_TEAM = {
    ev: {
      d: 1
    }

  };

  var TESTING_JOINTEAM_REQUEST = {
    "a => x": {
      from_user_uid: "a",
      to_team_uid: "x",
      event_uid: "ev"
    }

  };

  var TESTING_INVITEMEMBER_REQUEST = {
    "z => b": {
      from_team_uid: "z",
      to_member_uid: "b",
      event_uid: "ev"
    }

  };



  var NEW_TIMEOUT = 15000;
  var jasmineDefaultTimeout;

  var dbRefUserInfo,
      dbRefTeam,
      dbRefUserHaveTeam;

  var dbRefJoinTeam,
      dbRefInviteMember;

  var $rootScope, $matchingRequestService;



  beforeAll(function() {
    jasmineDefaultTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = NEW_TIMEOUT;
  });

  beforeAll(function(done) {
    function initializeFirebase() {
      firebase.initializeApp({
        apiKey: "AIzaSyCOmrU3k2Z4QjArla9407F7-HLTKgdLNbQ",
        authDomain: "swissknife-7fcb4.firebaseapp.com",
        databaseURL: "https://swissknife-7fcb4.firebaseio.com",
        storageBucket: "swissknife-7fcb4.appspot.com",
        messagingSenderId: "537458686494"
      });
            
    };

    try {
      firebase.app();
    } catch (exception) {
      initializeFirebase();
      done();

      return;
    }

    firebase.app().delete().then(function() {
      initializeFirebase();
      done();
    });

  });

  beforeAll(function() {
    var dbRef = firebase.database().ref();

    dbRefUserInfo = dbRef.child("user_info");
    dbRefTeam = dbRef.child("team");
    dbRefUserHaveTeam = dbRef.child("user_have_team");

    dbRefJoinTeam = dbRef.child("jointeam_request");
    dbRefInviteMember = dbRef.child("invitemember_request");
  });



  afterAll(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineDefaultTimeout;
  });



  beforeEach(module("thehonorclub"));

  beforeEach(module(function($provide, $urlRouterProvider) {
    $provide.value("$ionicTemplateCache", function() {});
    $urlRouterProvider.deferIntercept();
  }));  

  beforeEach(inject(function(_$rootScope_, _$matchingRequestService_) {
    $rootScope = _$rootScope_;
    $matchingRequestService = _$matchingRequestService_;
  }));

  beforeEach(function(done) {
    var doneCount = 5;
    function allDone() {
      --doneCount;
      if (doneCount == 0) {
        done();
      }

    }

    function failPrepare() {
      fail("Error preparing testing database!");
    }

    dbRefUserInfo.set(TESTING_USER)
    .then(allDone)
    .catch(failPrepare)

    dbRefTeam.set(TESTING_TEAM)
    .then(allDone)
    .catch(failPrepare);

    dbRefUserHaveTeam.set(TESTING_USER_HAVE_TEAM)
    .then(allDone)
    .catch(failPrepare);

    dbRefJoinTeam.set(TESTING_JOINTEAM_REQUEST)
    .then(allDone)
    .catch(failPrepare);

    dbRefInviteMember.set(TESTING_INVITEMEMBER_REQUEST)
    .then(allDone)
    .catch(failPrepare);    
  });



  function applyScope() {
    var applyScopeIntervalHandler;
    var countTick = 5;

    function doTick() {
      if (countTick == 0) {
        clearInterval(applyScopeIntervalHandler);
        return;
      }

      --countTick;
      $rootScope.$apply();
    }

    applyScopeIntervalHandler = setInterval(doTick, 1500);
  }



  it("joinTeam, REQUEST_INVALID", function(done) {
    $matchingRequestService.joinTeam("d", "x", "ev")
    .then(function(status) {
      expect(status).toEqual($matchingRequestService.REQUEST_INVALID);
      done();
    })
    .catch(function() {
      fail("Error executing joinTeam");
    });

    applyScope();
  });



  it("joinTeam, REQUEST_INVALID", function(done) {
    $matchingRequestService.joinTeam("a", "y", "ev")
    .then(function(status) {
      expect(status).toEqual($matchingRequestService.REQUEST_INVALID);
      done();
    })
    .catch(function() {
      fail("Error executing joinTeam");
    });

    applyScope();
  });  



  it("joinTeam, REQUEST_NOMATCH", function(done) {
    var testResult = {
      from_user_uid: "a",
      to_team_uid: "z",
      event_uid: "ev"
    };

    $matchingRequestService.joinTeam("a", "z", "ev")
    .then(function(status) {
      expect(status).toEqual($matchingRequestService.REQUEST_NOMATCH);

      dbRefJoinTeam.child("a => z")
      .once("value")
      .then(function(snapshot) {
        expect(snapshot.val()).toEqual(testResult);
        done();
      });

    })
    .catch(function() {
      fail("Error executing joinTeam");
    });

    applyScope();
  });  



  it("joinTeam, REQUEST_MATCH", function(done) {
    $matchingRequestService.joinTeam("b", "z", "ev")
    .then(function(status) {
      expect(status).toEqual($matchingRequestService.REQUEST_MATCH);
      done();
    })
    .catch(function() {
      fail("Error executing joinTeam");
    });

    applyScope();
  });    



  it("inviteMember, REQUEST_INVALID", function(done) {
    $matchingRequestService.inviteMember("x", "d", "ev")
    .then(function(status) {
      expect(status).toEqual($matchingRequestService.REQUEST_INVALID);
      done();
    })
    .catch(function() {
      fail("Error executing joinTeam");
    });

    applyScope();
  });



  it("inviteMember, REQUEST_INVALID", function(done) {
    $matchingRequestService.inviteMember("y", "a", "ev")
    .then(function(status) {
      expect(status).toEqual($matchingRequestService.REQUEST_INVALID);
      done();
    })
    .catch(function() {
      fail("Error executing joinTeam");
    });

    applyScope();
  });  



  it("inviteMember, REQUEST_NOMATCH", function(done) {
    var testResult = {
      from_team_uid: "x",
      to_member_uid: "c",
      event_uid: "ev"
    };

    $matchingRequestService.inviteMember("x", "c", "ev")
    .then(function(status) {
      expect(status).toEqual($matchingRequestService.REQUEST_NOMATCH);

      dbRefInviteMember.child("x => c")
      .once("value")
      .then(function(snapshot) {
        expect(snapshot.val()).toEqual(testResult);
        done();
      });

    })
    .catch(function() {
      fail("Error executing joinTeam");
    });

    applyScope();
  });  



  it("inviteMember, REQUEST_MATCH", function(done) {
    $matchingRequestService.inviteMember("x", "a", "ev")
    .then(function(status) {
      expect(status).toEqual($matchingRequestService.REQUEST_MATCH);
      done();
    })
    .catch(function() {
      fail("Error executing joinTeam");
    });

    applyScope();
  });    


});