angular.module("thehonorclub") 

.controller('EventInfoCtrl', function($scope, $stateParams, $http) {
    
  //Get Firebase event
  function getFirebaseEvent() {
    var databaseRef = firebase.database().ref();
    var currentUser = $firebaseAuthInstance.$getAuth();
    return $firebaseObject(databaseRef.child("event").child($stateParams.eventUid));
  }
  var firebaseEvent = getFirebaseEvent();
  
  // Convert FireBase Event to event (Functions and variables)
  var event = {};

  var getStartDate= function() {
    return moment.unix(firebaseEvent.timestamp_begin).format("DD/MM/YYYY");
  }

  var getStartTime = function() {
    return moment.unix(firebaseEvent.timestamp_begin).format("hh:mm a");
  }

  function getEndDate() {
    return moment.unix(firebaseEvent.timestamp_end).format("DD/MM/YYYY");
  }

  function getEndTime() {
    return moment.unix(firebaseEvent.timestamp_end).format("hh:mm a");
  }

  event.name = firebaseEvent.name;
  event.description = firebaseEvent.description;
  event.location = firebaseEvent.location;
  event.email = firebaseEvent.email;
  event.min_team_size = firebaseEvent.min_member_per_team;
  event.max_team_size = firebaseEvent.max_member_per_team;
  event.start_date = getStartDate();
  event.start_time = getStartTime();
  event.end_date = getEndDate();
  event.end_time = getEndTime();

  // Social Sharing
  var message = "Hey, checkout this event" + event.name + "."; 

  $scope.shareTwitter = function() {
    $cordovaSocialSharing.canShareVia("twitter", message).then(function(result) {
      $cordovaSocialSharing.shareViaTwitter(message);
    }, function(error) { alert("Cannot share on Twitter");});
  }

  $scope.shareInstagram = function() {
    $cordovaSocialSharing.canShareVia("instagram", message).then(function(result) {
      $cordovaSocialSharing.shareViaInstagram(message);
    }, function(error) { alert("Cannot share on Instagram");});
  }

  $scope.shareWhatsApp = function() {
    $cordovaSocialSharing.canShareVia("whatsapp", message).then(function(result) {
      $cordovaSocialSharing.shareViaWhatsApp(message);
    }, function(error) { alert("Cannot share on WhatsApp");});
  }
  
  $scope.shareFacebook = function() {
    $cordovaSocialSharing.canShareVia("facebook", message).then(function(result) {
      $cordovaSocialSharing.shareViaFacebook(message);
    }, function(error) { alert("Cannot share on Facebook");});
  }

  //Google Location Map
  var address = event.location;
  // Get the latitude and longitude
  $scope.latitude, $scope.longitude;
  $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyDxeIXJA3pdyq8mwVUla-Kcva7e8LHDo3k')
    .then(function(_results){
      $scope.latitude = _results.data.results[0].geometry.location.lat;
      $scope.longitude = _results.data.results[0].geometry.location.lng;
     }, 
     function error(_error){
       $scope.latitude = 22.3364;
       $scope.longitude = 114.2655;
     });

  // Adding the location to the Map
  $scope.map;
  $scope.mapLocation = {lat: $scope.latitude, lng: $scope.longitude};
  function initMap() {
    $scope.map = new google.maps.Map($scope.map, {
      center: $scope.mapLocation,
      zoom: 15
    });
  }
  
  // Adding the marker to the location
  $scope.marker;
  $scope.marker = new google.maps.Marker({ 
    position: $scope.mapLocation,
    map: $scope.map
  });

});
