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

	describe('attr: modal', function () {
		it('should default to false', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.children().hasClass('ng-dialogbox-show-close')).toEqual(true);
		}));

		it('should accept modal', inject(function ($compile) {
			createElement($compile, $scope, { modal: true });

			expect(element.children().hasClass('ng-dialogbox-show-close')).toEqual(false);
		}));

		it('should update modal', inject(function ($compile) {
			$scope.modal = true;
			createElement($compile, $scope, { modal: '{{ modal }}' });

			expect(element.children().hasClass('ng-dialogbox-show-close')).toEqual(false);

			$scope.$apply(function () {
				$scope.modal = false;
			});

			expect(element.children().hasClass('ng-dialogbox-show-close')).toEqual(true);
		}));
	});

	describe('attr: size', function () {
		it('should auto specify size', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.children().children().hasClass('ng-dialogbox-medium')).toEqual(true);
		}));

		it('should accept size', inject(function ($compile) {
			createElement($compile, $scope, { size: 'small' });

			expect(element.children().children().hasClass('ng-dialogbox-small')).toEqual(true);
		}));

		it('should update size', inject(function ($compile) {
			$scope.size = 'small';
			createElement($compile, $scope, { size: '{{ size }}' });

			expect(element.children().children().hasClass('ng-dialogbox-small')).toEqual(true);

			$scope.$apply(function () {
				$scope.size = 'medium';
			});

			expect(element.children().children().hasClass('ng-dialogbox-small')).toEqual(false);
			expect(element.children().children().hasClass('ng-dialogbox-medium')).toEqual(true);
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

		it('should update width', inject(function ($compile) {
			$scope.width = 200;
			createElement($compile, $scope, { width: '{{ width }}' });

			expect(element.children().children().css('width')).toEqual('200px');

			$scope.$apply(function () {
				$scope.width = 500;
			});

			expect(element.children().children().css('width')).toEqual('500px');
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

		it('should update height', inject(function ($compile) {
			$scope.height = 200;
			createElement($compile, $scope, { height: '{{ height }}' });

			expect(element.children().children().css('height')).toEqual('200px');

			$scope.$apply(function () {
				$scope.height = 500;
			});

			expect(element.children().children().css('height')).toEqual('500px');
		}));
	});

	describe('attr: caption', function () {
		it('should default to empty', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.find('h1').text()).toEqual('');
		}));

		it('should accept caption', inject(function ($compile) {
			var text = 'Hello World';
			createElement($compile, $scope, { caption: text });

			expect(element.find('h1').text()).toEqual(text);
		}));

		it('should update caption', inject(function ($compile) {
			$scope.caption = 'Hello';
			createElement($compile, $scope, { caption: '{{ caption }}'});

			expect(element.find('h1').text()).toEqual('Hello');

			$scope.$apply(function () {
				$scope.caption = 'World';
			});

			expect(element.find('h1').text()).toEqual('World');
		}));
	});

	describe('attr: subcaption', function () {
		it('should default to not show subcaption', inject(function ($compile) {
			createElement($compile, $scope);

			expect(element.children().hasClass('ng-dialogbox-show-subcaption')).toEqual(false);
		}));

		it('should show subcaption when attribute is set', inject(function ($compile) {
			var text = 'Lorem Ipsum';
			createElement($compile, $scope, { subcaption: text });

			expect(element.children().hasClass('ng-dialogbox-show-subcaption')).toEqual(true);
			expect(element.find('header').children().eq(2).text()).toEqual(text);
		}));

		it('should update subcaption', inject(function ($compile) {
			$scope.subcaption = 'Lorem';
			createElement($compile, $scope, { subcaption: '{{ subcaption }}' });

			expect(element.find('header').children().eq(2).text()).toEqual('Lorem');

			$scope.$apply(function () {
				$scope.subcaption = 'Ipsum';
			});

			expect(element.find('header').children().eq(2).text()).toEqual('Ipsum');
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

	// TODO: triggerHandler isn't passing keyCode
	//describe('event: esc', function () {
	//	it('should close when esc key is pressed', inject(function ($document, $dialogbox, $compile) {
	//		createElement($compile, $scope, {'ng-dialogbox': 'foo'});
	//
	//		$dialogbox.get('foo').then(function (dialog) {
	//			dialog.open();
	//			expect(dialog.active).toEqual(true);
	//
	//			$document.triggerHandler('keyup', {keyCode: 27, which: 27});
	//
	//			expect(dialog.active).toEqual(false);
	//		});
	//	}));
	//});

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
});