angular.module('thehonorclub')
.controller('loginController', ['$scope', '$stateParams', '$firebaseAuthInstance', function ($scope, $stateParams, $firebaseAuthInstance) {

	console.log($firebaseAuthInstance);
	console.log($firebaseAuthInstance.$getAuth());

	$scope.login = function(authMethod) {
    $firebaseAuthInstance.$signInWithRedirect(authMethod)
		.then(function(authData) {
	    if (authData === null) {
	      console.log('Not logged in yet');
	    } else {
	      console.log('Logged in as', authData.uid);
	    }
	    // This will display the user's name in our view
	    $scope.authData = authData;
		})
		.catch(function(error) {
			if (error.code === 'TRANSPORT_UNAVAILABLE') {
      	$firebaseAuthInstance.$signInWithPopup(authMethod).then(function(authData) {
					console.log(authData);
      	});
      } 
      else {
      	console.log(error);
  		}
    });
  };

}]);