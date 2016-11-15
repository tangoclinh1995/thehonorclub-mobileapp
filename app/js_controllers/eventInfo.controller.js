angular.module("thehonorclub") 

.controller('EventRequestCtrl', function($scope, $cordovaSocialSharing) {
    
  //Get Firebase event
  function getFirebaseEvent() {}
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

});
