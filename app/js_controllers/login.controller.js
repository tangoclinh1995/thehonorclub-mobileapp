angular.module('thehonorclub')
.controller('loginController', ['$scope', '$state', '$stateParams', '$firebaseAuthInstance', function ($scope, $state, $stateParams, $firebaseAuthInstance) {
  var dbRefUserInfo = firebase.database().ref("user_info");
  var signInUser;

	var currentUser = $firebaseAuthInstance.$getAuth();
	if (currentUser != undefined) {
    $state.go('userprofile');
	}

	// Sign out
	$scope.logout = () => {
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		  console.log("signed out");
			console.log(firebase.auth());
			localStorage.removeItem(currentUser.uid);
			$state.go('evmtRequest');
		}, function(error) {
		  // An error happened.
	  	console.error(error);
		});
	};

	$scope.requestEvent = function() {
		$state.go('evmtRequest');
	}
	
	$scope.login = function() {
		var provider = new firebase.auth.FacebookAuthProvider();
		// firebase.auth().signInWithRedirect(provider);
		// firebase.auth().getRedirectResult().then(function(result) {

		//   // This gives you a Facebook Access Token. You can use it to access the Facebook API.
		//   var token = result.credential.accessToken;

		//   signInUser = result.user;

  //     // Check whether this is first time user
  //     // Chain to NEXT THEN
  //     return dbRefUserInfo.child(signInUser.uid).once("value");

		// })
    firebase.auth().signInWithPopup(provider).then(function(result) {

		  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
		  var token = result.credential.accessToken;

		  signInUser = result.user;

      // Check whether this is first time user
      // Chain to NEXT THEN
      return dbRefUserInfo.child(signInUser.uid).once("value");

		})
    .then(function(snapshot) {

      // The path user_info/<USER_UID> does not exist, so this is first time user
      // Insert basic profile
      if (!snapshot.exists()) {
        dbRefUserInfo.child(signInUser.uid).set({
          name: signInUser.displayName,
          photoURL: signInUser.photoURL,
          email: signInUser.providerData[0].email,
          bio: "",

          skills: [],
          desired_positions: [],

          leader_of: {},
          member_of: {}          
        });

      }

      $state.go('userprofile');
    })    
		.catch(function(error) {
      console.log(error);

		});

  };

}]);