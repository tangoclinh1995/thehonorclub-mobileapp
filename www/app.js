angular.module("thehonorclub", ["ionic", "ionic-datepicker", "firebase", "ionic.contrib.ui.tinderCards"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}).config(function($stateProvider, $urlRouterProvider) {
  // Default state
  $urlRouterProvider.otherwise('/login');

}).directive('noScroll', function() {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $element.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
}).controller('CardsCtrl', function($scope, TDCardDelegate) {
  var cardTypes = [
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/max.jpg' },
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/ben.png' },
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/perry.jpg' },
  ];

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.unshift(angular.extend({}, newCard));
  }
  
  $scope.cards = [];
  for(var i = 0; i < 3; i++) $scope.addCard();
}).controller('CardCtrl', function($scope, TDCardDelegate) {
  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    $scope.addCard();
  };
});;
