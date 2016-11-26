angular.module('thehonorclub')
.controller('loginController', ['$scope', '$state', '$stateParams', '$firebaseAuthInstance', function ($scope, $state, $stateParams, $firebaseAuthInstance) {
  var dbRefUserInfo = firebase.database().ref("user_info");
  var signInUser;

	var currentUser = $firebaseAuthInstance.$getAuth();
	console.log(currentUser);
	if (currentUser != undefined) {
    $state.go('dashboard');
	}

	// Sign out
	$scope.logout = function() {
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
		firebase.auth().signInWithRedirect(provider);
		$state.go('loading');
  };

}]);