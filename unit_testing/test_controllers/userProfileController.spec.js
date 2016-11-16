describe("userProfileController", function() {
  var TESTUSER_UID = "584938239";

  var TESTUSER_INFO = {
    name: "Test User 1",
    bio: "This is a testing bio",
    photoURL: "www.testing.com/photo.jpg",

    skills: ["javascript", "c++", "python"],
    desired_positions: ["developer", "presentor", "designer"],

    leader_of: ["1", "2", "4", "5"],
    member_of: ["5", "7", "8", "10"]
  };

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

    _$controller_("userProfileController", {
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
    expect($scope.profile.name).toEqual(TESTUSER_INFO.name);
    expect($scope.photoURL).toEqual(TESTUSER_INFO.photoURL);
    expect($scope.profile.bio).toEqual(TESTUSER_INFO.bio);

    expect($scope.skills).toEqual(TESTUSER_INFO.skills);
    expect($scope.desiredPositions).toEqual(TESTUSER_INFO.desired_positions);

    expect($scope.isSavingProfile).toEqual(false);
  });

  it("$scope.addSkill", function() {
    $scope.addSkill("   javascript  ");
    expect($scope.skills).toEqual(TESTUSER_INFO.skills);
    expect($scope.profile.newSkill).toEqual("");

    var expectedResultAfterAddition = JSON.parse(JSON.stringify(TESTUSER_INFO.skills));
    expectedResultAfterAddition.push("html5"); 

    $scope.addSkill("html5");
    expect($scope.skills).toEqual(expectedResultAfterAddition);
    expect($scope.profile.newSkill).toEqual("");
  });

  it("$scope.removeSkill", function() {
    $scope.removeSkill("  html5   ");
    expect($scope.skills).toEqual(TESTUSER_INFO.skills);

    var expectedResultAfterRemoval = JSON.parse(JSON.stringify(TESTUSER_INFO.skills));
    expectedResultAfterRemoval.splice(expectedResultAfterRemoval.indexOf("javascript"), 1);

    $scope.removeSkill("javascript");
    expect($scope.skills).toEqual(expectedResultAfterRemoval);

    $scope.skills = [];
    $scope.removeSkill("javascript");
    expect($scope.skills).toEqual([]);
  });

  it("$scope.addPosition", function() {
    $scope.addPosition("developer");
    expect($scope.desiredPositions).toEqual(TESTUSER_INFO.desired_positions);
    expect($scope.profile.newPosition).toEqual("");

    var expectedResultAfterAddition = JSON.parse(JSON.stringify(TESTUSER_INFO.desired_positions));
    expectedResultAfterAddition.push("project manager"); 

    $scope.addPosition("project       manager");
    expect($scope.desiredPositions).toEqual(expectedResultAfterAddition);
    expect($scope.profile.newPosition).toEqual("");
  });

  it("$scope.removePosition", function() {
    $scope.removePosition("entrepreneur");
    expect($scope.desiredPositions).toEqual(TESTUSER_INFO.desired_positions);

    var expectedResultAfterRemoval = JSON.parse(JSON.stringify(TESTUSER_INFO.desired_positions));
    expectedResultAfterRemoval.splice(expectedResultAfterRemoval.indexOf("presentor"), 1);

    $scope.removePosition("presentor");
    expect($scope.desiredPositions).toEqual(expectedResultAfterRemoval);
    
    $scope.desiredPositions = [];
    $scope.removePosition("javascript");
    expect($scope.desiredPositions).toEqual([]);    
  });

  it("$scope.saveProfile: Promise Resolved", function() {
    $scope.profile.name = "Test User New Name";
    $scope.profile.bio = "Test User New Bio";

    $scope.photoURL = "http://accidentiallyChangeURL";

    $scope.skills = ["javascript", "delphi"];
    $scope.desiredPositions = ["seller", "innovator", "strategist"];

    $scope.saveProfile();

    expect($scope.isSavingProfile).toEqual(true);

    saveDefer.resolve();
    $scope.$apply();

    expect(userInfo.name).toEqual($scope.profile.name);
    expect(userInfo.bio).toEqual($scope.profile.bio);

    expect(userInfo.skills).toEqual($scope.skills);
    expect(userInfo.desired_positions).toEqual($scope.desiredPositions);

    expect(userInfo.photoURL).not.toEqual($scope.photoURL);
    expect(userInfo.photoURL).toEqual(TESTUSER_INFO.photoURL);

    expect(userInfo.member_of).toEqual(TESTUSER_INFO.member_of);
    expect(userInfo.leader_of).toEqual(TESTUSER_INFO.leader_of);

    expect($scope.isSavingProfile).toEqual(false);
  });

  it("$scope.saveProfile: Promise Rejected", function() {
    $scope.saveProfile();

    expect($scope.isSavingProfile).toEqual(true);

    saveDefer.reject();
    $scope.$apply();

    expect($scope.isSavingProfile).toEqual(false);
  });

});