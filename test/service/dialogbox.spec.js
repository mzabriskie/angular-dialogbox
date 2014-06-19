describe('angular-dialogbox', function () {
	var $scope;

	beforeEach(module('angular-dialogbox'));

	beforeEach(inject(function ($rootScope) {
		$scope = $rootScope.$new();
	}));

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

		it('should get an instance', inject(function ($dialogbox) {
			$dialogbox.create('foo');

			expect($dialogbox.get('foo')).not.toBeUndefined();
		}));

		it('should resolve a promise', inject(function ($dialogbox) {
			$dialogbox.create('foo');

			var callback = jasmine.createSpy();
			$dialogbox.get('foo').then(callback);
			$scope.$apply();

			expect(callback).toHaveBeenCalled();
		}));

		it('should have options', inject(function ($dialogbox) {
			$dialogbox.create('foo', {modal: true});

			$dialogbox.get('foo').then(function (dialog) {
				expect(dialog.options.modal).toEqual(true);
			});
		}));

		it('should default modal option to false', inject(function ($dialogbox) {
			$dialogbox.create('foo');

			$dialogbox.get('foo').then(function (dialog) {
				expect(dialog.options.modal).toEqual(false);
			});
		}));

		it('should not close when modal', inject(function ($dialogbox) {
			$dialogbox.create('foo', {modal: true});

			$dialogbox.get('foo').then(function (dialog) {
				dialog.open();
				dialog.close();
				expect(dialog.active).toEqual(true);
			});
		}));

		it('should activate by calling open', inject(function ($dialogbox) {
			$dialogbox.create('foo');

			$dialogbox.get('foo').then(function (dialog) {
				dialog.open();
				expect(dialog.active).toEqual(true);
			});
		}));

		it('should deactivate by calling close', inject(function ($dialogbox) {
			$dialogbox.create('foo');

			$dialogbox.get('foo').then(function (dialog) {
				dialog.open();
				dialog.close();
				expect(dialog.active).toEqual(false);
			});
		}));
	});
});