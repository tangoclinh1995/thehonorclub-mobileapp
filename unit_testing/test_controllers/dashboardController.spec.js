describe("dashboardController", function() {
  var TESTUSER_UID = "1";

  var TESTUSER_INFO = {
    name: "user1",
    bio: "test bio",
    photoURL: "www.testing.com/photo.jpg",

    skills: ["javascript", "c++"],
    desired_positions: ["developer", "presentor"],

    leader_of: ["11"],
    member_of: ["22"]
  };

  var TESTEVENT_INFO = {
    ["111"] : {
      name: "event1",
      description: "desc1",

      timestamp_begin:"1234567",
      timestamp_end:"123456778",

      min_member_per_team:1 ,
      max_member_per_team:10 
    },

    ["222"] : {
      name: "event2",
      description: "desc2",

      timestamp_begin:"1234567",
      timestamp_end:"123456778",

      min_member_per_team:1 ,
      max_member_per_team:10 
    }
  
  }

  var TESTALLUSER_INFO = {
    ["1"]: {
      name: "user1",
      bio: "test bio",
      photoURL: "www.testing.com/photo.jpg",

      skills: ["javascript", "c++"],
      desired_positions: ["developer", "presentor"],

      leader_of: ["11"],
      member_of: ["22"]
    },
    ["2"]: {
      name: "user2",
      bio: "test bio",
      photoURL: "www.testing.com/photo.jpg",

      skills: ["c++", "python"],
      desired_positions: ["presentor", "designer"],

      leader_of: ["22"],
      member_of: ["11"]
    }
  }

  var TESTTEAM_INFO = {
    ["11"]: {
      event_uid: ["111"],
      name: "team1" ,
      description: "team1 desc",
      skills_needed: {},
      positions_needed: {},
      leader_uid: ["1"],
      members_uid: { ["2"]: 1},
      current_size: 2,
      can_add_more: 0
    },
    ["22"]: {
      event_uid: ["222"],
      name: "team2" ,
      description: "team2 desc",
      skills_needed: {},
      positions_needed: {},
      leader_uid: ["2"],
      members_uid: {["1"]: 1},
      current_size: 2,
      can_add_more: 0
    }
  }

  var eventInfo, teamInfo, allUserInfo;


  var EXPECTED_USERINFO_REF_STRING = "user_info/" + TESTUSER_UID;

  var testUser;
  var userInfoRefString;

  var $scope;
  var $firebaseObject, $firebaseAuthInstance;

  var userInfo, loadedDefer, saveDefer;

  beforeAll(function(done) {
    function initializeFirebase() {
      firebase.initializeApp({
        apiKey: "fakeapikey",
        authDomain: "fakeauthdomain.fakefirebaseapp.com",
        databaseURL: "https://fakeauthdomain.fakefirebaseapp.com",
        storageBucket: "fakeauthdomain.fakeappspot.com",
        messagingSenderId: "fakemsgid"      
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

  beforeEach(module("thehonorclub"));

  // IMPORTANT:
  //    This helps ensure that Ionic UI Router will not break the test
  //    It MUST be added after the line: beforeEach(module("thehonorclub"));
  beforeEach(module(function($provide, $urlRouterProvider) {
    $provide.value("$ionicTemplateCache", function() {});
    $urlRouterProvider.deferIntercept();
  }));  

  beforeEach(inject(function(_$rootScope_, _$controller_, _$firebaseAuthInstance_, _$q_) {
    $scope = _$rootScope_.$new();

    // Inject a "fake" user UID
    $firebaseAuthInstance = _$firebaseAuthInstance_;

    spyOn($firebaseAuthInstance, "$getAuth")
    .and
    .returnValue({uid: TESTUSER_UID});

    // Inject "fake" user information
    $firebaseObject = jasmine.createSpy("$firebaseObject");
    $firebaseObject.and.callFake(function(userInfoDatabaseRef) {
      var rootRefStrLen = userInfoDatabaseRef.root.toString().length;

      userInfoRefString =
        userInfoDatabaseRef.toString()
        .substring(rootRefStrLen);

      userInfo = {
        name: TESTUSER_INFO.name,
        photoURL: TESTUSER_INFO.photoURL,
        bio: TESTUSER_INFO.bio,

        skills: {},
        desired_positions: {},

        leader_of: TESTUSER_INFO.leader_of,
        member_of: TESTUSER_INFO.member_of,

        $loaded: function() {},
        $save: function() {}
      };

      eventInfo = TESTEVENT_INFO;
      teamInfo = TESTTEAM_INFO;
      allUserInfo = TESTALLUSER_INFO;



      var arrayToObjectFields = ["skills", "desired_positions"];
      for (var i = 0, i_len = arrayToObjectFields.length; i < i_len; ++i) {
        var field = arrayToObjectFields[i];
        
        for (var j = 0, j_len = TESTUSER_INFO[field].length; j < j_len; ++j) {
          userInfo[field][j] = TESTUSER_INFO[field][j];
        }

      }

      loadedDefer = _$q_.defer();
      saveDefer = _$q_.defer();

      spyOn(userInfo, "$loaded").and.returnValue(loadedDefer.promise);
      spyOn(userInfo, "$save").and.returnValue(saveDefer.promise);     

      return userInfo;
    });

    

    _$controller_("dashboardController", {
      $scope: $scope,
      $firebaseObject: $firebaseObject,
      $firebaseAuthInstance: $firebaseAuthInstance
    });

    loadedDefer.resolve();
    $scope.$apply();
  }));

  it("Correct Database Reference", function() {
    expect(userInfoRefString).toEqual(EXPECTED_USERINFO_REF_STRING);
  });

  it("Initial values on $scope: name, photoURL, bio, skills, desiredPositions, isSavingProfile", function() {
    expect($scope.name).toEqual(TESTUSER_INFO.name);
    expect($scope.photoURL).toEqual(TESTUSER_INFO.photoURL);
    expect($scope.bio).toEqual(TESTUSER_INFO.bio);

    expect($scope.skills).toEqual(TESTUSER_INFO.skills);
    expect($scope.desiredPositions).toEqual(TESTUSER_INFO.desired_positions);

    expect($scope.isSavingProfile).toEqual(false);
  });

  it("$scope.toggleEvent", function() {
    $scope.isTeamShown(TESTTEAM_INFO["11"]) = true;
    $scope.toggleEvent(TESTTEAM_INFO["11"]);
    expect($scope.shownTeam).toEqual(null);
    
    $scope.isTeamShown(TESTTEAM_INFO["11"]) = false;
    $scope.toggleEvent(TESTTEAM_INFO["11"]);
    expect($scope.shownTeam).toEqual(TESTTEAM_INFO["11"]);
  });

  it("$scope.isTeamShown", function() {
    $scope.shownTeam = TESTTEAM_INFO["11"];
    expect($scope.shownTeam(TESTTEAM_INFO["11"])).toEqual(true);

    $scope.shownTeam = null;
    expect($scope.shownTeam(TESTTEAM_INFO["11"])).toEqual(false);
  });



  

});