describe("cardController", function () {

    beforeEach(module('thehonorclub'));

    describe('Testing the Directive', function () {
/*
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
*/
      var compile, scope, directiveElem;
      
      beforeEach(function() {

        inject(function($compile, $rootScope){
            compile = $compile;
            scope = $rootScope.$new();
           });

        directiveElem = getCompiledElement();
        
      });

      function getCompiledElement(){

        var element = angular.element('<div noScroll></div>');
        var compiledElement = compile(element)(scope);
        return compiledElement;
      }

      it('should do something', function () {

          event tm = directiveElem.find('touchmove');
          $scope.$digest();
          expect(elem.preventDefault()).toHaveBeenCalled();
      
      });

    });

    describe('Testing the Controller', function () {

      var ctrlr,scope;

      beforeEach(inject(function(_CardController_,$rootScope) {

        scope = $rootScope.$new();
        ctrlr = scope._CardController_;

      }));

      it('should create a deck of 3 cards', function () {

          expect(cards.length).toBe(3);

      });

      it('should add a new card to the deck', function () {

          var x = cards.length;
          addCard();
          expect(cards.length).toBe(x+1);

      });

      it('should destroy a card', function () {

          var y = cards.length;
          cardDestroyed();
          expect(cards.length).toBe(y-1);

      });

    });

    describe('Testing the Second Controller', function () {

      var ctrlr2;

      beforeEach(inject(function($controller) {

        ctrlr2 = $controller('CardCtrl');

        cards = [];
        for(var i = 0; i < 3; i++) $addCard();

      }));

      it('should swipe left and add card', function () {

          expect(addCard).toHaveBeenCalled();

      });

      it('should swipe right and add card', function () {

          expect(addCard).toHaveBeenCalled();

      });

    });

});
