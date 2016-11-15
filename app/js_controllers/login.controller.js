angular.module('thehonorclub')
.controller('loginController', ['$scope', '$state', '$stateParams', 'Auth', function ($scope, $state, $stateParams, Auth) {

	// Sign out
	// firebase.auth().signOut().then(function() {
	//   // Sign-out successful.
	//   console.log("signed out");
	// 	console.log(firebase.auth());
	// }, function(error) {
	//   // An error happened.
 //  	console.error(error);
	// });

	$scope.requestEvent = function() {
		$state.go('evmtRequest');
	}
	
	$scope.login = function() {
		var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
		  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
		  var token = result.credential.accessToken;

		  // The signed-in user info.
		  var user = result.user;
		  var user_info = {
		  	name: user.displayName,
		  	photoURL: user.photoURL,
		  	email: user.providerData[0].email
		  };

      firebase.database().ref('user_info/'+user.uid).set(user_info);
  		$state.go('userprofile');

		})
		.catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.error(errorMessage);
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		  // ...
		});

  //   firebase.auth().signInWithRedirect(provider);
  //   firebase.auth().getRedirectResult().then(function(authData) {
	 //    if (authData === null) {
	 //      console.log('Not logged in yet');
	 //    } 
	 //    else {
	 //    	// console.log(authData);
	 //      // console.log('Logged in as', authData.user);
	 //      // firebase.database().ref('users/'+firebase.auth().currentUser.providerData[0].uid).set(firebase.auth().currentUser.providerData[0])
  //   		$state.go('userprofile');
	      
	 //      // firebase.database().ref('users/'+authData.user.providerData[0].uid).set(authData.user.providerData[0]);
		//     // This will display the user's name in our view
		//     // $firebaseAuthInstance.authData = authData.providerData;
	 //    	// $scope.user = authData.user.providerData[0];
	 //    }
		// })
		// .catch(function(error) {
		// 	if (error.code === 'TRANSPORT_UNAVAILABLE') {
  //     	firebase.auth().signInWithPopup(provider).then(function(authData) {
		// 			console.log(authData);
  //     	});
  //     } 
  //     else {
  //     	console.error(error);
  // 		}
  //   });

  }; // END of $scope.login

}]);