describe('angular-dialogbox', function () {
	var $scope, element;

	function createElement($compile, $scope, attr, transclude) {
		element = angular.element('<div ng-dialogbox' + (attr && attr['ng-dialogbox'] ? '="' + attr['ng-dialogbox'] + '"' : '') + '>' + (transclude || '') + '</div>');

		for (var k in attr) {
			if (attr.hasOwnProperty(k)) {
				element.attr(k, attr[k]);
			}
		}

		$compile(element)($scope);
		$scope.$digest();

		return element;
	}

	beforeEach(module('angular-dialogbox'));

	beforeEach(inject(function ($rootScope) {
		$scope = $rootScope.$new();
	}));

	afterEach(inject(function($httpBackend) {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	}));

	describe('attr: modal', function () {
		it('should default to false', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.children().hasClass('ng-dialogbox-show-close')).toBeFalsy();
		}));

		it('should accept modal', inject(function ($compile) {
			createElement($compile, $scope, { modal: true });

			expect(element.children().hasClass('ng-dialogbox-show-close')).toBeTruthy();
		}));
	});

	describe('attr: size', function () {
		it('should auto specify size', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.children().children().hasClass('ng-dialogbox-medium')).toBeTruthy();
		}));

		it('should accept size', inject(function ($compile) {
			createElement($compile, $scope, { size: 'small' });

			expect(element.children().children().hasClass('ng-dialogbox-small')).toBeTruthy();
		}));
	});

	describe('attr: width', function () {
		it('should default to no width', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.children().children().css('width')).toEqual('');
		}));

		it('should set width', inject(function ($compile) {
			createElement($compile, $scope, { width: 200 });

			expect(element.children().children().css('width')).toEqual('200px');
		}));
	});

	describe('attr: height', function () {
		it('should default to no height', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.children().children().css('height')).toEqual('');
		}));

		it('should set height', inject(function ($compile) {
			createElement($compile, $scope, { height: 200 });

			expect(element.children().children().css('height')).toEqual('200px');
		}));
	});

	describe('attr: heading', function () {
		it('should default to empty', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.find('h1').text()).toEqual('');
		}));

		it('should accept heading', inject(function ($compile) {
			var text = 'Hello World';
			createElement($compile, $scope, { heading: text });

			expect(element.find('h1').text()).toEqual(text);
		}));
	});

	describe('attr: subheading', function () {
		it('should default to not show subheading', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.children().hasClass('ng-dialogbox-show-subheading')).toBeFalsy();
		}));

		it('should show subheading when attribute is set', inject(function ($compile) {
			var text = 'Lorem Ipsum';
			createElement($compile, $scope, { subheading: text });

			expect(element.children().hasClass('ng-dialogbox-show-subheading')).toBeTruthy();
			expect(element.find('header').children().eq(2).text()).toEqual(text);
		}));
	});

	describe('attr: content', function () {
		it('should default to empty', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.children().children().children().children().eq(1).text()).toEqual('');
		}));

		it('should accept content', inject(function ($compile) {
			var text = 'This is content';
			createElement($compile, $scope, { content: text });

			expect(element.children().children().children().children().eq(1).text()).toEqual(text);
		}));
	});

	describe('attr: contentUrl', function () {
		it('should use $http to load contentUrl', inject(function ($compile, $controller, $httpBackend) {
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

		it('should gracefully handle $http error', inject(function ($compile, $controller, $httpBackend) {
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

	describe('attr: buttons', function () {
		it('should default to no buttons', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.find('buttons').length).toEqual(0);
		}));

		it('should accept buttons', inject(function ($compile) {
			var buttons = {
				left: [{
					label: 'OK'
				}, {
					label: 'Cancel'
				}],
				right: [{
					label: 'Foo'
				}]
			};
			createElement($compile, $scope, { buttons: angular.toJson(buttons) });
			var menu = element.find('menu'),
				left = menu.eq(0).children(),
				right = menu.eq(1).children();

			expect(left.length).toEqual(2);
			expect(right.length).toEqual(1);
			expect(left.eq(0).text()).toEqual(buttons.left[0].label);
			expect(left.eq(1).text()).toEqual(buttons.left[1].label);
			expect(right.eq(0).text()).toEqual(buttons.right[0].label);
		}));
	});

	describe('transclusion', function () {
		it('should have no content by default', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.children().children().children().children().eq(1).text()).toEqual('');
		}));

		it('should transclude content', inject(function ($compile) {
			var text = 'This is transcluded content';
			createElement($compile, $scope, null, text);

			expect(element.children().children().children().children().eq(1).text()).toEqual(text);
		}));
	});

	describe('constants', function () {
		it('should provide button actions', inject(function (DIALOG_ACTION_SUBMIT, DIALOG_ACTION_CANCEL) {
			expect(DIALOG_ACTION_SUBMIT).toEqual('dialogbox:submit');
			expect(DIALOG_ACTION_CANCEL).toEqual('dialogbox:cancel');
		}));
	});

	describe('service', function () {
		it('should provide a service', inject(function ($dialogbox) {
			expect($dialogbox).not.toBeUndefined();
		}));

		it('should get an instance', inject(function ($compile, $dialogbox) {
			createElement($compile, $scope, {'ng-dialogbox': 'foo'});

			expect($dialogbox.get('foo')).not.toBeUndefined();
		}));

		it('should resolve a promise', inject(function ($compile, $dialogbox) {
			createElement($compile, $scope, {'ng-dialogbox': 'foo'});

			var callback = jasmine.createSpy();
			$dialogbox.get('foo').then(callback);
			$scope.$apply();

			expect(callback).toHaveBeenCalled();
		}));
	});
});