'use strict';

//Suscripcions service used to communicate Suscripcions REST endpoints
angular.module('suscripcions').factory('Suscripcions', ['$resource',
	function($resource) {
		return $resource('suscripcions/:suscripcionId', { suscripcionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);