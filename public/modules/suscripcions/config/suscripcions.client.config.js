'use strict';

// Configuring the Articles module
angular.module('suscripcions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Suscripcions', 'suscripcions', 'dropdown', '/suscripcions(/create)?');
		Menus.addSubMenuItem('topbar', 'suscripcions', 'List Suscripcions', 'suscripcions');
		Menus.addSubMenuItem('topbar', 'suscripcions', 'New Suscripcion', 'suscripcions/create');
	}
]);