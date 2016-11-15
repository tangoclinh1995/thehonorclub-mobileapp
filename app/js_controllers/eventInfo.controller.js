angular.module("thehonorclub") 

.controller('EventRequestCtrl', function($scope, $cordovaSocialSharing) {
    
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
