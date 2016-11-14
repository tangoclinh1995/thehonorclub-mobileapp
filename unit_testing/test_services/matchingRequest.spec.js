describe("$matchingRequest", function() {
  var TESTING_JOINTEAM_REQUEST = {
    "0": {
      from_user_uid: "1",
      to_team_uid: "6"
    },
    "1": {
      from_user_uid: "2",
      to_team_uid: "3"
    },

  };

  var TESTING_INVITEMEMBER_REQUEST = {
    "4": {
      from_team_uid: "7",
      to_member_uid: "5"
    },
    "7": {
      from_team_uid: "8",
      to_member_uid: "1"
    }

  };

  var NEW_TIMEOUT = 5000;
  var jasmineDefaultTimeout;

  var dbRefJoinTeam, dbRefInviteMember, dbRefUserInfo, dbRefTeam;

  var $rootScope;



  beforeAll(function() {
    jasmineDefaultTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = NEW_TIMEOUT;
  });

  beforeAll(function() {
    firebase.initializeApp({
      apiKey: "AIzaSyCOmrU3k2Z4QjArla9407F7-HLTKgdLNbQ",
      authDomain: "swissknife-7fcb4.firebaseapp.com",
      databaseURL: "https://swissknife-7fcb4.firebaseio.com",
      storageBucket: "swissknife-7fcb4.appspot.com",
      messagingSenderId: "537458686494"
    });

    var db = firebase.database();

    dbRefJoinTeam = db.ref().child("jointeam_request");
    dbRefInviteMember = db.ref().child("invitemember_request");
    dbRefUserInfo = db.ref().child("user_info");
    dbRefTeam = db.ref().child("team");
  });



  afterAll(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineDefaultTimeout;
  });



  beforeEach(module("thehonorclub"));

  beforeEach(inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
  }));

});