angular.module(
  "thehonorclub",
  ["ionic", "ionic-datepicker", "ionic-timepicker", "firebase", "ionic.contrib.ui.tinderCards", "ngCordova"]
)

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
      $state.go("login");
    }

  });

  // Monitor Angular UI Router state change, if detect that a non-Sign-in page is
  // being directed to without user signing in, then force redirecting back to
  // Signin page
  $rootScope.$on("$stateChangeStart", function(even, toState) {
    // Don't care if upcoming state is Signin or Request Event
    if (toState.name == "login" || toState.name == "evmtRequest") {
      return;
    }

    // Otherwise, check whether user has been signed in
    if (firebase.auth().currentUser == null) {
      // TRICK: Wait a litte bit before redirection to make sure
      // redirection successfully occurs
      setTimeout(function() {
        $state.go("login");
      }, 100);

    }

  }); 

})

.constant("FIREBASE_KEY", 'MY_FIREBASE_KEY')

.config(function($stateProvider, $urlRouterProvider) {
  // Default state
  $urlRouterProvider.otherwise('/login');

});
