angular.module('angular-dialogbox', ['ng'])
	.constant('DIALOG_ACTION_SUBMIT', 'dialogbox:submit')
	.constant('DIALOG_ACTION_CANCEL', 'dialogbox:cancel')

	.factory('$dialogbox', function ($q) {
		var instances = {};

		function DialogBox(name) {
			if (!instances[name]) {
				instances[name] = $q.defer();
			}
			instances[name].resolve(this);
		}

		DialogBox.get = function (name) {
			if (!instances[name]) {
				instances[name] = $q.defer();
			}
			return instances[name].promise;
		};

		DialogBox.prototype = {
			open: function () {
				this.active = true;
			},

			close: function () {
				this.active = false;
			}
		};

		return DialogBox;
	})

	.controller('DialogboxCtrl', ['$scope', '$http', function ($scope, $http) {
		$scope.loadRemoteContent = function () {
			$http({ method: 'GET', url: $scope.contentUrl })
				.success(function (data) {
					$scope.content = data;
				})
				.error(function () {
					$scope.content = 'Error fetching content from ' + $scope.contentUrl;
				});
		};

		if ($scope.contentUrl) {
			$scope.loadRemoteContent();
		}
	}])

	.directive('ngDialogbox', function ($dialogbox) {
		return {
			restrict: 'AE',
			transclude: true,
			scope: {
				modal: '@',
				size: '@',
				height: '@',
				width: '@',
				heading: '@',
				subheading: '@',
				content: '@',
				contentUrl: '@',
				buttons: '='
			},

			template:	'<div ng-show="dialogbox.active" class="ng-dialogbox-scrim" ng-class="{ \'ng-dialogbox-show-close\' : modal, \'ng-dialogbox-show-subheading\' : subheading.length, \'ng-dialogbox-show-menu\' : buttons.left.length || buttons.right.length }">' +
							'<div class="ng-dialogbox-border">' +
								'<div class="ng-dialogbox">' +
									'<header class="ng-dialogbox-header">' +
										'<div class="ng-dialogbox-options">' +
											'<a class="ng-dialogbox-close">×</a>' +
										'</div>' +
										'<h1 class="ng-dialogbox-heading">{{ heading }}</h1>' +
										'<div class="ng-dialogbox-subheading">{{ subheading }}</div>' +
									'</header>' +
									'<div class="ng-dialogbox-content">{{ content }}' +
										'<div ng-transclude></div>' +
									'</div>' +
									'<div class="ng-dialogbox-footer">' +
										'<menu class="ng-dialogbox-left">' +
											'<button ng-repeat="b in buttons.left">{{ b.label }}</button>' +
										'</menu>' +
										'<menu class="ng-dialogbox-right">' +
											'<button ng-repeat="b in buttons.right">{{ b.label }}</button>' +
										'</menu>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>',

			controller: 'DialogboxCtrl',

			link: function (scope, elem, attr) {
				if (attr.ngDialogbox) {
					scope.dialogbox = new $dialogbox(attr.ngDialogbox);
				}

				if (!scope.size) {
					scope.size = 'medium';
				}

				elem.find('header').find('a').on('click', function () {
					scope.$apply(function () {
						scope.dialogbox.close();
					});
				});

				var container = elem.children().children();
				container.addClass('ng-dialogbox-' + scope.size);

				if (!isNaN(parseInt(scope.height, 10))) {
					container.css('height', parseInt(scope.height, 10) + 'px');
				}

				if (!isNaN(parseInt(scope.width, 10))) {
					container.css('width', parseInt(scope.width, 10) + 'px');
				}
			}
		};
	});