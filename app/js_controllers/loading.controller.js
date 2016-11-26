angular.module("thehonorclub")
.controller("loadingController", ['$state', '$stateParams', '$firebaseAuthInstance', function ($state, $stateParams, $firebaseAuthInstance) {
  
  var dbRefUserInfo = firebase.database().ref("user_info");
  var signInUser;

	var currentUser = $firebaseAuthInstance.$getAuth();
	console.log(currentUser);
	if (currentUser != undefined) {
		console.log(currentUser);
    $state.go('dashboard');
	}

	firebase.auth().getRedirectResult().then(function(result) {
		console.log(result);
		if(result.user) {
			$firebaseAuthInstance.$setAuth(result.user);
			var currentUser = $firebaseAuthInstance.$getAuth();
			console.log(currentUser);
			$state.go('dashboard');
		}
	})
	.catch(function(error) {
	  console.log(error);
	});
	firebase.auth().getRedirectResult().then(function(result) {
		if(result.user) {
			$firebaseAuthInstance.$setAuth(result.user);
			console.log(result);
		  signInUser = result.user;

      // Check whether this is first time user
      // Chain to NEXT THEN
      return dbRefUserInfo.child(signInUser.uid).once("value");
		}
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
    	$state.go('userprofile');
    }
    else {
	    $state.go('dashboard');
    }

  })    
	.catch(function(error) {
    console.log(error);
	});
}]);
