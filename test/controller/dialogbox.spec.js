describe('angular-dialogbox', function () {
	var $scope;

	beforeEach(module('angular-dialogbox'));

	beforeEach(inject(function ($rootScope) {
		$scope = $rootScope.$new();
	}));

	afterEach(inject(function($httpBackend) {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	}));

	describe('contentUrl', function () {
		it('should use $http to load contentUrl', inject(function ($controller, $httpBackend) {
			var text = 'Content came form the server';
			$controller('DialogboxCtrl', { $scope: $scope });
			$scope.contentUrl = '/example.html';

			$httpBackend
				.expect('GET', $scope.contentUrl)
				.respond(text);

			$scope.$apply(function () {
				$scope.loadRemoteContent();
			});

			$httpBackend.flush();

			expect($scope.content).toEqual(text);
		}));

		it('should gracefully handle $http error', inject(function ($controller, $httpBackend) {
			var text = 'Error fetching content from ';
			$controller('DialogboxCtrl', { $scope: $scope });
			$scope.contentUrl = '/example.html';

			$httpBackend
				.expect('GET', $scope.contentUrl)
				.respond(404);

			$scope.$apply(function () {
				$scope.loadRemoteContent();
			});

			$httpBackend.flush();

			expect($scope.content).toEqual(text + $scope.contentUrl);
		}));
	});
});