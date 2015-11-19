'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Contacto = mongoose.model('Contacto'),
	_ = require('lodash');

/**
 * Create a Contacto
 */
exports.create = function(req, res) {
	var contacto = new Contacto(req.body);
	contacto.user = req.user;

	contacto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contacto);
		}
	});
};

/**
 * Show the current Contacto
 */
exports.read = function(req, res) {
	res.jsonp(req.contacto);
};

/**
 * Update a Contacto
 */
exports.update = function(req, res) {
	var contacto = req.contacto ;

	contacto = _.extend(contacto , req.body);

	contacto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contacto);
		}
	});
};

/**
 * Delete an Contacto
 */
exports.delete = function(req, res) {
	var contacto = req.contacto ;

	contacto.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contacto);
		}
	});
};

/**
 * List of Contactos
 */
exports.list = function(req, res) { 
	Contacto.find().sort('-created').populate('user', 'displayName').exec(function(err, contactos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contactos);
		}
	});
};

/**
 * Contacto middleware
 */
exports.contactoByID = function(req, res, next, id) { 
	Contacto.findById(id).populate('user', 'displayName').exec(function(err, contacto) {
		if (err) return next(err);
		if (! contacto) return next(new Error('Failed to load Contacto ' + id));
		req.contacto = contacto ;
		next();
	});
};

/**
 * Contacto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.contacto.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
