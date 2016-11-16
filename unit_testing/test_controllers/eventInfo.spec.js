describe("EventInfoCtrl", function() {
  var $scope, $cordovaSocialSharing;

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

it("Start Date test", function() {

    var firebase_event = {
        timestamp_begin: "1477094400"
    }
    var date = "22/10/2016";
    var funcDate = getStartDate();
    expect(funcDate).toEqual(date);
});

it("End Date test", function() {

    var firebase_event = {
        timestamp_end: "1477094400"
    }
    var date = "22/10/2016";
    var funcDate = getEndDate();
    expect(funcDate).toEqual(date);
});

});