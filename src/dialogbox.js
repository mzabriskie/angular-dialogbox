angular.module('angular-dialogbox', ['ng'])
	.directive('ngDialogbox', function () {
		return {
			restrict: 'AE',
			scope: {
				heading: '@',
				subheading: '@',
				content: '@',
				contentUrl: '@',
				buttons: '='
			},

			template:	'<div class="ng-dialogbox-scrim" ng-class="{ \'ng-dialogbox-show-subheading\' : subheading.length, \'ng-dialogbox-show-menu\' : buttons.left.length || buttons.right.length }">' +
							'<div class="ng-dialogbox-border">' +
								'<div class="ng-dialogbox">' +
									'<header class="ng-dialogbox-header">' +
										'<div class="ng-dialogbox-options">' +
											'<a class="ng-dialogbox-close" ng-click="close()">×</a>' +
										'</div>' +
										'<h1 class="ng-dialogbox-heading">{{ heading }}</h1>' +
										'<div class="ng-dialogbox-subheading">{{ subheading }}</div>' +
									'</header>' +
									'<div class="ng-dialogbox-content">{{ content }}</div>' +
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

			controller: ['$scope', '$http', function ($scope, $http) {
				if ($scope.contentUrl) {
					$http({ method: 'GET', url: $scope.contentUrl })
						.success(function (data) {
							$scope.content = data;
						})
						.error(function () {
							$scope.content = 'Error fetching content from ' + $scope.contentUrl;
						});
				}

				$scope.close = function () {
					console.log('close');
				};
			}],

			link: function (scope, elem, attr) {
				console.log(attr);
			}
		};
	});