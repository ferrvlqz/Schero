'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var suscripcions = require('../../app/controllers/suscripcions.server.controller');

	// Suscripcions Routes
	app.route('/suscripcions')
		.get(suscripcions.list)
		.post(users.requiresLogin, suscripcions.create);

	app.route('/suscripcions/:suscripcionId')
		.get(suscripcions.read)
		.put(users.requiresLogin, suscripcions.hasAuthorization, suscripcions.update)
		.delete(users.requiresLogin, suscripcions.hasAuthorization, suscripcions.delete);

	// Finish by binding the Suscripcion middleware
	app.param('suscripcionId', suscripcions.suscripcionByID);
};
