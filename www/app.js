angular.module("thehonorclub", ["ionic", "ionic-datepicker", "firebase"])

.run(function($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  // Monitor authentication state, if detect user has signed out, then automatically
  // redirect to Signin page
  firebase.auth().onAuthStateChanged(function(user) {
    // Null user object means "Signed Out"
    if (user == null) {
      $state.go("signin");
    }

  });

  // Monitor Angular UI Router state change, if detect that a non-Sign-in page is
  // being directed to without user signing in, then force redirecting back to
  // Signin page
  $rootScope.$on("$stateChangeStart", function(even, toState) {
    // Don't care if upcoming state is Signin
    if (toState.name == "signin") {
      return;
    }

    // Otherwise, check whether user has been signed in
    if (firebase.auth().currentUser == null) {
      // TRICK: Wait a litte bit before redirection to make sure
      // redirection successfully occurs
      setTimeout(function() {
        $state.go("signin");
      }, 100);

    }

  }); 

})

.config(function($stateProvider, $urlRouterProvider) {
  // Default state
  $urlRouterProvider.otherwise('/signin');

});
