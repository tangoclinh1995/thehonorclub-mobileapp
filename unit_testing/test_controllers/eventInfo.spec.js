describe("EventInfoCtrl", function() {
  var $scope, $cordovaSocialSharing, $state, $cordovaGeolocation, $http, $firebaseObject, $firebaseAuthInstance;

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

  

});