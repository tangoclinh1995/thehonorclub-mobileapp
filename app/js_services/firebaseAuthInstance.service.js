angular.module("thehonorclub")
.factory("$firebaseAuthInstance", function(firebaseKey) {
	var factory = {};	console.log(firebaseKey);
	var auth = JSON.parse(localStorage.getItem("firebase:authUser:"+firebaseKey+":[DEFAULT]"));
	console.log(auth);
	factory.getAuth() = () => { return auth; };

	return factory;
});