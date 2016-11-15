angular.module("thehonorclub")
.factory("Auth", function(firebaseKey) {

	console.log(firebaseKey);
	var auth = JSON.parse(localStorage.getItem("firebase:authUser:"+firebaseKey+":[DEFAULT]"));
	console.log(auth);

	return auth;
});