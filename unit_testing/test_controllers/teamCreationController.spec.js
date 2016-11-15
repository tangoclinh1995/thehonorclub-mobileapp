describe("TeamCreationCtrl", function() {
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
        apiKey: "AIzaSyCbp4SaA4QXRfZG63iN40wFRvvC6L89MBE",
        authDomain: "comp3111h-95365.firebaseapp.com",
        databaseURL: "https://comp3111h-95365.firebaseio.com",
        storageBucket: "comp3111h-95365.appspot.com",
        messagingSenderId: "588844821215"
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
  //beforeEach(module("evmtFormTemplate"));

  beforeEach(module(function($provide, $urlRouterProvider) {
    $provide.value('$ionicTemplateCache', function() {});
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, $ionicTemplateCache, $httpBackend, _$firebaseObject_, _$firebaseAuthInstance_, _$ionicLoading_, _$tagStandardizeHelper_, _$state_) {
    //var request = new XMLHttpRequest();

    $scope = _$rootScope_.$new();
    _$state_.params.max_member_per_team = 5;
    _$state_.params.event_uid = 123456;
    $state = _$state_



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

    _$controller_("TeamCreationCtrl", {
      $scope: $scope,
      $state: _$state_,
      $firebaseObject: _$firebaseObject_,
      $firebaseAuthInstance: $firebaseAuthInstance,
      $ionicLoading: _$ionicLoading_,
      $tagStandardizeHelper: _$tagStandardizeHelper_
    });

    //$httpBackend.expectGET("templates/evmt_form.html").respond(evmt_form);

    $scope.$apply();
  }));

  it("Testing $scope.addSkill", function() {
    $scope.newSkill = '  Python Coding  ';
    $scope.addSkill();
    expect($scope.skills).toEqual(['python coding']);
    expect($scope.newSkill).toEqual('');
  });

  it("Testing $scope.removeSkill", function() {
    $scope.skills = ['java programming', 'python coding'];
    $scope.removeSkill(0);
    expect($scope.skills).toEqual(['python coding']);
  });

  it("Testing $scope.addPosition", function() {
    $scope.newPosition = 'Coder';
    $scope.no = 3;
    $scope.addPosition();
    expect($scope.positions['Coder']).toEqual(3);
    expect($scope.newPosition).toEqual('');
    expect($scope.no).toEqual(1);
  });

  it("Testing $scope.removePosition", function() {
    $scope.positions = {'Coder': 1};
    $scope.removePosition('Coder');
    expect($scope.positions.hasOwnProperty('Coder')).toEqual(false);
  });


  it("Saving team to firebase", function() {
    $scope.name = 'UnitTestTeam';
    $scope.description =  'Unit Testing for Team Creation';
    $scope.skills = ['java programming', 'python coding'];

    $scope.addTeam();

    firebase.database().ref('team/').on('child_added', function(data) {
      expect(data.val().event_uid).toEqual(123456);
      expect(data.val().name).toBe('UnitTestTeam');  
      expect(data.val().description).toEqual('Unit Testing for Team Creation');
      expect(data.val().skills_needed).toEqual(['java programming', 'python coding']);
      expect(data.val().positions_needed).toEqual({'leader': 1});
      expect(data.val().members_uid).not.toBeDefined();
      expect(data.val().current_size).toEqual(1);
      expect(data.val().can_add_more).toEqual(4);
    })

  });



});