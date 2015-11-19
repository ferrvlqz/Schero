'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var contactos = require('../../app/controllers/contactos.server.controller');

	// Contactos Routes
	app.route('/contactos')
		.get(contactos.list)
		.post(users.requiresLogin, contactos.create);

	app.route('/contactos/:contactoId')
		.get(contactos.read)
		.put(users.requiresLogin, contactos.hasAuthorization, contactos.update)
		.delete(users.requiresLogin, contactos.hasAuthorization, contactos.delete);

	// Finish by binding the Contacto middleware
	app.param('contactoId', contactos.contactoByID);
};
