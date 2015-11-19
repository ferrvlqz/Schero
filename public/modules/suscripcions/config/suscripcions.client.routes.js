'use strict';

//Setting up route
angular.module('suscripcions').config(['$stateProvider',
	function($stateProvider) {
		// Suscripcions state routing
		$stateProvider.
		state('listSuscripcions', {
			url: '/suscripcions',
			templateUrl: 'modules/suscripcions/views/list-suscripcions.client.view.html'
		}).
		state('createSuscripcion', {
			url: '/suscripcions/create',
			templateUrl: 'modules/suscripcions/views/create-suscripcion.client.view.html'
		}).
		state('viewSuscripcion', {
			url: '/suscripcions/:suscripcionId',
			templateUrl: 'modules/suscripcions/views/view-suscripcion.client.view.html'
		}).
		state('editSuscripcion', {
			url: '/suscripcions/:suscripcionId/edit',
			templateUrl: 'modules/suscripcions/views/edit-suscripcion.client.view.html'
		});
	}
]);