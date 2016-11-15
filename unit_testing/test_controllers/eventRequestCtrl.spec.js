describe("EventRequestCtrl", function() {
  var $scope, ionicTimePicker, ionicDatePicker;

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

  beforeEach(inject(function(_$rootScope_, _$controller_, _ionicTimePicker_, _ionicDatePicker_, _$q_, $ionicTemplateCache, $httpBackend) {
    //var request = new XMLHttpRequest();

    $scope = _$rootScope_.$new();

    ionicDatePicker = _ionicDatePicker_;
    ionicTimePicker = _ionicTimePicker_;

    _$controller_("EventRequestCtrl", {
      $scope: $scope,
      ionicDatePicker: ionicDatePicker,
      ionicTimePicer: ionicTimePicker
    });

    //$httpBackend.expectGET("templates/evmt_form.html").respond(evmt_form);

    $scope.$apply();
  }));

  it("callStartTimer, picked time 14:00", function() {
    // Inject fake timepicker which always return 1970/1/1 14:00 
    spyOn(ionicTimePicker, 'openTimePicker').and.callFake(function(timeObj) {
      timeObj.callback(50400);
    });

    $scope.callStartTimer();
    expect($scope.startTime).toEqual('14:00');
  });

  it("callStartTimer, no valid date picked", function() {
    spyOn(ionicTimePicker, 'openTimePicker').and.callFake(function(timeObj) {
      timeObj.callback(undefined);
    });
    
    $scope.callStartTimer();
    expect($scope.startTime).toEqual('');

  });

  it("callEndTimer, picked time 16:00", function() {
    // Inject fake timepicker which always return 1970/1/1 16:00 
    spyOn(ionicTimePicker, 'openTimePicker').and.callFake(function(timeObj) {
      timeObj.callback(57600);
    });

    $scope.callEndTimer();
    expect($scope.endTime).toEqual('16:00');
  });

  it("callEndTimer, no valid date picked", function() {
    spyOn(ionicTimePicker, 'openTimePicker').and.callFake(function(timeObj) {
      timeObj.callback(undefined);
    });
    
    $scope.callEndTimer();
    expect($scope.endTime).toEqual('');

  });

  it("callStartDatePicker", function() {
    // Inject a fake datepicker which always return 2016-06-12
    spyOn(ionicDatePicker, 'openDatePicker').and.callFake(function(dateObj) {
      dateObj.callback(1465689600000);
    });

    $scope.callStartDatePicker();
    expect($scope.startDate).toEqual('2016-06-12');
    
  });

  it("callEndDatePicker", function() {
    // Inject a fake datepicker which always return 2016-06-14
    spyOn(ionicDatePicker, 'openDatePicker').and.callFake(function(dateObj) {
      dateObj.callback(1465862400000);
    });

    $scope.callEndDatePicker();
    expect($scope.endDate).toEqual('2016-06-14');
    
  });

  it("Saving event to firebase", function() {
    $scope.name = 'UnitTestEvent';
    $scope.description =  'Unit Testing for Event';
    // 2016-06-12 14:00
    $scope.startDate = '2016-06-12';
    // 2016-06-12 16:00
    $scope.endDate = '2016-06-12';
    $scope.startTime = '14:00';
    $scope.endTime  = '16:00';
    $scope.minSize = 3;
    $scope.maxSize = 7;
    $scope.email = 'randome@gmail.com';
    $scope.location = 'Hong Kong University of Science and Technology'

    $scope.addEvent();

    firebase.database().ref('event/').on('child_added', function(data) {
      expect(data.val().name).toBe('UnitTestEvent');  
      expect(data.val().description).toBe('Unit Testing for Event');
      expect(data.val().timestamp_begin).toBe(1465740000);
      expect(data.val().timestamp_end).toBe(1465747200);
      expect(data.val().min_member_per_team).toBe(3);
      expect(data.val().max_member_per_team).toBe(7);
      expect(data.val().email).toBe('randome@gmail.com');
      expect(data.val().location).toBe('Hong Kong University of Science and Technology');
    })

  });



});