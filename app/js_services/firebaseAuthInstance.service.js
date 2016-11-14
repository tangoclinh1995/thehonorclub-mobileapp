angular.module("thehonorclub")
.factory("$firebaseAuthInstance", function($firebaseAuth) {
  var usersRef = firebase.auth();
  // console.log(usersRef);
  return $firebaseAuth(usersRef);
  // return $firebaseAuth();
});