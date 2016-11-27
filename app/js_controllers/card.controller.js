angular.module('thehonorclub').directive('noScroll', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $element.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})
.controller('CardsController', ['$scope', '$state', 'TDCardDelegate', '$firebaseAuthInstance', function($scope, $state, TDCardDelegate, $firebaseAuthInstance) {
  
  var currentUser = $firebaseAuthInstance.$getAuth();
  console.log(currentUser);
  if (currentUser == undefined) {
    console.log(currentUser);
    $state.go('login');
  }

  var cardTypes = [
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/max.jpg', name: 'Andy', skill: 'AngularJS' },
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/ben.png', name: 'Bob', skill: 'NodeJS' },
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/perry.jpg', name: 'Charlie', skill: 'Ionic' },
  ];

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
    $scope.addCard();
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.unshift(angular.extend({}, newCard));
  }

  $scope.cards = [];
  for(var i = 0; i < 3; i++) $scope.addCard();  

  $scope.cardSwipedLeft = function(index) {
    console.log("left" + index);
  };
  $scope.cardSwipedRight = function(index) {
    console.log("right" + index);
  };

}]);
