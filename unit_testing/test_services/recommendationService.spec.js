describe("$recommendationService", function() {
  var TESTING_USER = {};

  var TESTING_TEAM = {};

  var TESTING_USER_HAVE_TEAM = {};

  var TESTING_JOINTEAM_REQUEST = {};

  var TESTING_INVITEMEMBER_REQUEST = {};



  var NEW_TIMEOUT = 5000;
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



  
  describe("recommendTeam", function() {
    beforeEach(function(done) {

    });

    it("Should return correct list of recommended team", function(done) {

    });

  });



  describe("recommendMember", function() {
    beforeEach(function(done) {

    });

    it("Should return correct list of recommended member", function(done) {

    });
    
  });  

});