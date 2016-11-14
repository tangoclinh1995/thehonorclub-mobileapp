describe("$recommendationService", function() {
  var TESTING_USER = {
    a: {
      skills: ["a", "b", "c", "d"],
      desired_positions: ["a", "b"]
    },
    b: {
      skills: ["b", "e", "f"],
      desired_positions: ["c"]
    },
    c: {
      skills: ["a", "c", "f", "g"],
      desired_positions: ["b"]
    }

  };

  var TESTING_TEAM = {
    x: {
      event_uid: "3",
      can_add_more: 2,
      skills_needed: {
        "f": 0,
        "a": 1,
        "b": 4
      },
      positions_needed: {
        "a": 1,
        "b": 0,
        "c": 2
      }

    },

    y: {
      event_uid: "3",
      can_add_more: 0,
      skills_needed: {
        "a": 5,
      },
      positions_needed: {
        "a": 4,
        "b": 1,
        "c": 0
      }

    },

    z: {
      event_uid: "3",
      can_add_more: 2,
      skills_needed: {
        "c": 5,
        "g": 0,
        "a": 2,
        "b": 3,
      },
      positions_needed: {
        "a": 0,
        "b": 2,
        "c": 1
      }

    },    

  };

  var TESTING_USER_HAVE_TEAM = {
    "3": {
      "b": 1
    }

  };

  var TESTING_JOINTEAM_REQUEST = {};

  var TESTING_INVITEMEMBER_REQUEST = {};



  var NEW_TIMEOUT = 10000;
  var jasmineDefaultTimeout;

  var dbRefUserInfo,
      dbRefTeam,
      dbRefUserHaveTeam;

  var dbRefJoinTeam,
      dbRefInviteMember;

  var $rootScope, $recommendationService;



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

  beforeEach(inject(function(_$rootScope_, _$recommendationService_) {
    $rootScope = _$rootScope_;
    $recommendationService = _$recommendationService_;
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



  
  it("recommendTeam", function(done) {
    var countApplyScope = 4;
    function applyScope() {
      if (countApplyScope == 0) {
        return;
      }

      --countApplyScope;
      $rootScope.$apply();

      setTimeout(applyScope, 1500);
    }

    $recommendationService.recommendTeam("a", "3")
    .then(function(result) {
      console.log(JSON.stringify(result));
      done();
    })
    .catch(function() {
      fail("Error calling recommendTeam function");
    });

    applyScope();    
  });



  it("recommendMember", function(done) {
    $recommendationService.recommendMember("x")
    .then(function(result) {
      console.log(JSON.stringify(result));
      done();
    })
    .catch(function() {
      fail("Error calling recommendMember function");
    });

  });

});