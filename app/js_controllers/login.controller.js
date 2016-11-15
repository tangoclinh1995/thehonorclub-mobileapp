angular.module('thehonorclub')
.controller('loginController', ['$scope', '$state', '$stateParams', '$firebaseAuthInstance', function ($scope, $state, $stateParams, $firebaseAuthInstance) {

	// console.log(firebase.auth());
	// console.log($scope.authData);
	// firebase.auth().signOut().then(function() {
	//   // Sign-out successful.
	//   console.log("signed out");
	// 	console.log(firebase.auth());
	// }, function(error) {
	//   // An error happened.
 //  	console.error(error);
	// });
	// console.log($firebaseAuthInstance.auth._._auth.currentUser);
  // firebase.database().ref().push(firebase.auth().currentUser.providerData);

  console.log($firebaseAuthInstance.provider);

	$scope.login = function() {
		var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithRedirect(provider);
		firebase.auth().getRedirectResult().then(function(authData) {
	    if (authData === null) {
	      console.log('Not logged in yet');
	    } 
	    else {
	    	// console.log(authData);
	      // console.log('Logged in as', authData.user);
	      firebase.database().ref('users/'+authData.user.providerData[0].uid).set(authData.user.providerData[0]);
	    	$state.go('userprofile');
	      // firebase.database().ref().push(firebase.auth().currentUser.providerData);
		    // This will display the user's name in our view
		    // $firebaseAuthInstance.authData = authData.providerData;
	    	// $scope.user = authData.user.providerData[0];
	    }
		})
		.catch(function(error) {
			if (error.code === 'TRANSPORT_UNAVAILABLE') {
      	firebase.auth().signInWithPopup(provider).then(function(authData) {
					console.log(authData);
      	});
      } 
      else {
      	console.error(error);
  		}
    });
  };

}]);