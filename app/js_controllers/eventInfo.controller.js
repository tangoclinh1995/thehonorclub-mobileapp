angular.module("thehonorclub") 

.controller('EventRequestCtrl', function($scope, $cordovaSocialSharing, $state, $cordovaGeolocation, $http, $firebaseObject, $firebaseAuthInstance) {
    
  //Get Firebase event
  function getFirebaseEvent() {
    var databaseRef = firebase.database().ref();
    var currentUser = $firebaseAuthInstance.$getAuth();
    return $firebaseObject(databaseRef.child("event").child($state.params.event_uid));
  }
  var firebaseEvent = getFirebaseEvent();
  
  // Convert FireBase Event to event (Functions and variables)
  var event = {};
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

  // Google Maps API
  var options = {timeout: 10000, enableHighAccuracy: true};
  var latLng;

  $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.location + '&key=AIzaSyDxeIXJA3pdyq8mwVUla-Kcva7e8LHDo3k').then(
    function(_results){
      latLng = new google.maps.LatLng(_results.data.results[0].geometry.location.lat, _results.data.results[0].geometry.location.lng);
    }, 
    function error(_error){
      $cordovaGeolocation.getCurrentPosition(options).then(
        function(position){ latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); },
        function(error){ latLng = new google.maps.LatLng(22.3364, 114.2655); }  // Centered at HKUST by Default
      ); 
    }
  )
    
  var mapOptions = {
    center: latLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
 
  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


  // Marker (Drops after loading the map)
  google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
    var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });       
  });

});
