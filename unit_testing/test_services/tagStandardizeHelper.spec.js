describe('tagStandardizeHelper', function () {

    beforeEach(module('thehonorclub'));

    describe('Testing the Factory', function () {

    	var tagStandardizeHelper;

    	beforeEach(inject(function(_$tagStandardizeHelper_) {

    		tagStandardizeHelper = _$tagStandardizeHelper_;

    	}));

    	it('should change to lowercase and reduce spaces', function () {

    		var tag = 'Google  Firebase';
    		
            var result = tagStandardizeHelper(tag);

    		expect(result).toMatch('google firebase');

    	});

    });

});

//scope, factry
/*scope = $rootScope.$new();
            factry = $factory('tagStandardizeHelper', {$scope:scope});
            */