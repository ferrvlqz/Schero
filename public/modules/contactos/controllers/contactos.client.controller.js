'use strict';

// Contactos controller
angular.module('contactos').controller('ContactosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contactos',
	function($scope, $stateParams, $location, Authentication, Contactos) {
		$scope.authentication = Authentication;

		// Create new Contacto
		$scope.create = function() {
			// Create new Contacto object
			var contacto = new Contactos ({
				name: this.name
			});

			// Redirect after save
			contacto.$save(function(response) {
				$location.path('contactos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Contacto
		$scope.remove = function(contacto) {
			if ( contacto ) { 
				contacto.$remove();

				for (var i in $scope.contactos) {
					if ($scope.contactos [i] === contacto) {
						$scope.contactos.splice(i, 1);
					}
				}
			} else {
				$scope.contacto.$remove(function() {
					$location.path('contactos');
				});
			}
		};

		// Update existing Contacto
		$scope.update = function() {
			var contacto = $scope.contacto;

			contacto.$update(function() {
				$location.path('contactos/' + contacto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Contactos
		$scope.find = function() {
			$scope.contactos = Contactos.query();
		};

		// Find existing Contacto
		$scope.findOne = function() {
			$scope.contacto = Contactos.get({ 
				contactoId: $stateParams.contactoId
			});
		};
	}
]);