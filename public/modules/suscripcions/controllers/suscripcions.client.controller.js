'use strict';

// Suscripcions controller
angular.module('suscripcions').controller('SuscripcionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Suscripcions',
	function($scope, $stateParams, $location, Authentication, Suscripcions) {
		$scope.authentication = Authentication;

		// Create new Suscripcion
		$scope.create = function() {
			// Create new Suscripcion object
			var suscripcion = new Suscripcions ({
				name: this.name
			});

			// Redirect after save
			suscripcion.$save(function(response) {
				$location.path('suscripcions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Suscripcion
		$scope.remove = function(suscripcion) {
			if ( suscripcion ) { 
				suscripcion.$remove();

				for (var i in $scope.suscripcions) {
					if ($scope.suscripcions [i] === suscripcion) {
						$scope.suscripcions.splice(i, 1);
					}
				}
			} else {
				$scope.suscripcion.$remove(function() {
					$location.path('suscripcions');
				});
			}
		};

		// Update existing Suscripcion
		$scope.update = function() {
			var suscripcion = $scope.suscripcion;

			suscripcion.$update(function() {
				$location.path('suscripcions/' + suscripcion._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Suscripcions
		$scope.find = function() {
			$scope.suscripcions = Suscripcions.query();
		};

		// Find existing Suscripcion
		$scope.findOne = function() {
			$scope.suscripcion = Suscripcions.get({ 
				suscripcionId: $stateParams.suscripcionId
			});
		};
	}
]);