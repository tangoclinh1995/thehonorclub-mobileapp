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
