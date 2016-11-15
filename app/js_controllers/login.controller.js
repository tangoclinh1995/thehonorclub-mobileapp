angular.module('thehonorclub')
.controller('loginController', ['$scope', '$state', '$stateParams', 'Auth', function ($scope, $state, $stateParams, Auth) {
  var dbRefUserInfo = firebase.database().ref("user_info");
  var signInUser;

	// // Sign out
	// firebase.auth().signOut().then(function() {
	//   // Sign-out successful.
	//   console.log("signed out");
	// 	console.log(firebase.auth());
	// }, function(error) {
	//   // An error happened.
  // 	console.error(error);
	// });

	$scope.requestEvent = function() {
		$state.go('evmtRequest');
	}
	
	$scope.login = function() {
		var provider = new firebase.auth.FacebookAuthProvider();
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

    // firebase.auth().signInWithRedirect(provider);
    // firebase.auth().getRedirectResult().then(function(authData) {
	  //   if (authData === null) {
	  //     console.log('Not logged in yet');
	  //   } 
	  //   else {
	  //   	// console.log(authData);
	  //     // console.log('Logged in as', authData.user);
	  //     // firebase.database().ref('users/'+firebase.auth().currentUser.providerData[0].uid).set(firebase.auth().currentUser.providerData[0])
    // 		$state.go('userprofile');
	      
	  //     // firebase.database().ref('users/'+authData.user.providerData[0].uid).set(authData.user.providerData[0]);
		//     // This will display the user's name in our view
		//     // $firebaseAuthInstance.authData = authData.providerData;
	  //   	// $scope.user = authData.user.providerData[0];
	  //   }
		// })
		// .catch(function(error) {
		// 	if (error.code === 'TRANSPORT_UNAVAILABLE') {
    //   	firebase.auth().signInWithPopup(provider).then(function(authData) {
		// 			console.log(authData);
    //   	});
    //   } 
    //   else {
    //   	console.error(error);
  	// 	}
    // });

  };

}]);