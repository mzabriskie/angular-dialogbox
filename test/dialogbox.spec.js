describe('angular-dialogbox', function () {
	var $scope, element;

	beforeEach(module('angular-dialogbox'));

	beforeEach(inject(function ($rootScope) {
		$scope = $rootScope.$new();
	}));

	it('should auto specify size', inject(function ($compile) {
		element = $compile('<div ng-dialogbox/>')($scope);

		expect(element.children().children().hasClass('ng-dialogbox-medium')).toEqual(true);
	}));
});