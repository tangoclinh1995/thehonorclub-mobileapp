angular.module("thehonorclub")
.factory("$firebaseAuthInstance", function($firebaseAuth) {
  return $firebaseAuth();
});