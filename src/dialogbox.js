angular.module('angular-dialogbox', ['ng'])
	.constant('DIALOG_ACTION_SUBMIT', 'dialogbox:submit')
	.constant('DIALOG_ACTION_CANCEL', 'dialogbox:cancel')

	.factory('$dialogbox', function ($q) {
		var instances = {};

		function DialogBox(name, options) {
			if (!instances[name]) {
				instances[name] = $q.defer();
			}
			this.name = name;
			this.options = options || {};
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
				if (!this.options.modal) {
					this.active = false;
				}
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

	.directive('ngDialogbox', function ($document, $dialogbox) {
		var hasDocumentKeyUpEvent = false;

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
				if (!hasDocumentKeyUpEvent) {
					$document.on('keyup', function (e) {
						if (e.keyCode === 27) {
							scope.$apply(function () {
								scope.dialogbox.close();
							});
						}
					});

					hasDocumentKeyUpEvent = true;
				}

				elem.find('header').find('a').on('click', function () {
					scope.$apply(function () {
						scope.dialogbox.close();
					});
				});

				if (attr.ngDialogbox) {
					scope.dialogbox = new $dialogbox(attr.ngDialogbox);

					scope.$watch('modal', function (value) {
						scope.dialogbox.options.modal = value === 'true' || value === true || false;
					});
				}

				if (!scope.size) {
					scope.size = 'medium';
				}
				var container = elem.children().children();
				container.addClass('ng-dialogbox-' + scope.size);

				var height = parseInt(scope.height, 10);
				if (!isNaN(height) && height > 0) {
					container.css('height', height + 'px');
				}

				var width = parseInt(scope.width, 10);
				if (!isNaN(width) && width > 0) {
					container.css('width', width + 'px');
				}
			}
		};
	});