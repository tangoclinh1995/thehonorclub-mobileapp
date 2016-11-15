describe("tagStandarizehelper", function () {

    beforeEach(module('thehonorclub'));

    describe('Testing the Factory', function () {

    	var scope, factry;

    	beforeEach(inject(function($factory, $rootScope) {

    		scope = $rootScope.$new();
    		factry = $factory('tagStandarizehelper', {$scope:scope});

    	}));

    	it('should change to lowercase and reduce spaces', function () {

    		scope.tag = "Google  Firebase";
    		scope.tagStandarizehelper(scope.tag);

    		expect(scope.tag).toBe("google firebase");

    	});

    });

});