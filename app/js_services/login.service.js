angular.module("thehonorclub")
.factory("$firebaseAuthInstance", function($firebaseAuth) {
  var usersRef = firebase.auth();
  var factory = {};
	factory.provider = new firebase.auth.FacebookAuthProvider();
	factory.auth = $firebaseAuth(usersRef);
	return factory;
});