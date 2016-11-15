angular.module("thehonorclub")
.factory("$timeoutFirebaseOnceQuery", function($q, $timeout) {
  var DEFAULT_INTERVAL = 1000;

  var EMPTY_DATASNAPSHOT = {
    forEach: function() {},
    exists: function() { return false; },
    val: function() { return null; }
  };

  return function(query, eventType, interval) {
    if (typeof interval != "number") {
      interval = DEFAULT_INTERVAL;
    }

    var defer = $q.defer();

    $timeout(function() {
      defer.resolve(EMPTY_DATASNAPSHOT);
    }, interval);

    query.once(eventType)
    .then(function(snapshot) {
      defer.resolve(snapshot);
    })
    .catch(function(error) {
      defer.reject(error);
    });

    return defer.promise;
  }

});