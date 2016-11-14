describe("EventRequestCtrl", function() {
  var $scope;

  beforeAll(function() {
    firebase.initializeApp({
      apiKey: "AIzaSyCbp4SaA4QXRfZG63iN40wFRvvC6L89MBE",
      authDomain: "comp3111h-95365.firebaseapp.com",
      databaseURL: "https://comp3111h-95365.firebaseio.com",
      storageBucket: "comp3111h-95365.appspot.com",
      messagingSenderId: "588844821215"
    });
  });

  beforeEach(module("thehonorclub"));
  beforeEach(module("evmtFormTemplate"));

  /*beforeEach(module(function($provide, $urlRouterProvider) {
    $provide.value('$ionicTemplateCache', function() {});
    $urlRouterProvider.deferIntercept();
  }));*/

  beforeEach(inject(function(_$rootScope_, _$controller_, _ionicTimePicker_, _ionicDatePicker_, _$q_, $ionicTemplateCache, $httpBackend) {
    //var request = new XMLHttpRequest();

    $scope = _$rootScope_.$new();


    _$controller_("EventRequestCtrl", {
      $scope: $scope,
      ionicDatePicker: _ionicDatePicker_,
      ionicTimePicer: _ionicTimePicker_
    });

    //$httpBackend.expectGET("templates/evmt_form.html").respond(evmt_form);

    $scope.$apply();
  }));

  /*it("Adding a start date: show end date and start time field", function() {
    $scope.callStartTimer();

  });*/

  /*it("Adding a start date: show end date and start time field", function() {
    console.log(JSON.stringify(angular.element(document)));
    expect(angular.element(document.querySelector('#endDate')).hasClass('ng-hide')).toBe(false);
    //expect(angular.element(document.getElementById('startTime')).hasClass('ng-hide')).toBe(false);

    $scope.startDate = '2016-06-12';
    
    expect(angular.element(document.querySelector('#endDate')).hasClass('ng-hide')).toBe(true);
    //expect(angular.element(document.getElementById('startTime')).hasClass('ng-hide')).toBe(true);

  });

  it("Adding a start time: show end time field", function() {
    expect(angular.element(document.getElementById('endTime')).hasClass('ng-hide')).toBe(false);

    $scope.startDate = '2016-06-12';
    $scope.starTime = '14:00';
    
    expect(angular.element(document.getElementById('endTime')).hasClass('ng-hide')).toBe(true);

  });*/

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

    $scope.addEvent();

    firebase.database().ref('event/').on('child_added', function(data) {
      expect(data.val().name).toBe('UnitTestEvent');  
      expect(data.val().description).toBe('Unit Testing for Event');
      expect(data.val().timestamp_begin).toBe(1465740000);
      expect(data.val().timestamp_end).toBe(1465747200);
      expect(data.val().min_member_per_team).toBe(3);
      expect(data.val().max_member_per_team).toBe(7);

    })

  });



});