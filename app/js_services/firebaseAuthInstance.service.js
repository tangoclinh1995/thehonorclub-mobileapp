angular.module("thehonorclub")
.factory("$firebaseAuthInstance", function(firebaseKey) {
	var factory = {};
	// console.log(firebaseKey);
	factory.auth = JSON.parse(localStorage.getItem("firebase:authUser:"+firebaseKey+":[DEFAULT]"));
	// console.log(factory.auth);
	factory.$getAuth = () => {
		return factory.auth;
	};
	factory.$setAuth = (auth) => {
		if (factory.auth != undefined) {
			console.log(factory.auth);
		}
		else {
			localStorage.setItem("firebase:authUser:"+firebaseKey+":[DEFAULT]",JSON.stringify(auth));
			factory.auth = auth;
		}
	};

	return factory;
});
