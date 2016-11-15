describe("cardController", function () {

    beforeEach(module('thehonorclub'));

    describe('Testing the Directive', function () {

      var $compile, $rootScope;
      var element, directve;

      beforeEach(inject(function(_$compile_, _$rootScope_) {

        compile = _$compile_;
        $rootScope = _$rootScope_;
        element = 'touchmove';
        directve = $directive('noScroll', {$rootScope:rootScope});

      }));

      it('should set preventDefault on', function () {
          expect(element.preventDefault()).toBeTruthy();
      });

    });

    describe('Testing the Controller', function () {

      var scope, ctrlr;

      beforeEach(inject(function($controller,$rootscope) {

        scope = $rootscope.$new();
        ctrlr = $controller('CardController', {$scope:scope});

      }));

      it('should create a deck of 3 cards', function () {

          expect(scope.cards.length).toBe(3);

      });

      it('should add a new card to the deck', function () {

          var x = scope.cards.length;
          scope.addCard();
          expect(scope.cards.length).toBe(x+1);

      });

      it('should destroy a card', function () {

          var y = scope.cards.length;
          scope.cardDestroyed();
          expect(scope.cards.length).toBe(y-1);

      });

    });

    describe('Testing the Second Controller', function () {

      var scope, ctrlr2;

      beforeEach(inject(function($controller,$rootscope) {

        scope = $rootscope.$new();
        ctrlr2 = $controller('CardCtrl', {$scope:scope});

        scope.cards = [];
        for(var i = 0; i < 3; i++) $scope.addCard();

      }));

      it('should swipe left and add card', function () {

          expect(scope.addCard).toHaveBeenCalled();

      });

      it('should swipe right and add card', function () {

          expect(scope.addCard).toHaveBeenCalled();

      });

    });

});

/*
angular.module('thehonorclub')

.directive('noScroll', function() {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $element.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.controller('CardController', function($scope, TDCardDelegate) {
  var cardTypes = [
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/max.jpg', name: 'Andy', skill: 'AngularJS' },
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/ben.png', name: 'Bob', skill: 'NodeJS' },
    { image: 'http://ionic-forum-static.s3.amazonaws.com/tinder/perry.jpg', name: 'Charlie', skill: 'Ionic' },
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
})

.controller('CardCtrl', function($scope, TDCardDelegate) {
  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    $scope.addCard();
  };
  
});
*/
