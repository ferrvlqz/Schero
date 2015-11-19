'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Suscripcion = mongoose.model('Suscripcion'),
	_ = require('lodash');

/**
 * Create a Suscripcion
 */
exports.create = function(req, res) {
	var suscripcion = new Suscripcion(req.body);
	suscripcion.user = req.user;

	suscripcion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suscripcion);
		}
	});
};

/**
 * Show the current Suscripcion
 */
exports.read = function(req, res) {
	res.jsonp(req.suscripcion);
};

/**
 * Update a Suscripcion
 */
exports.update = function(req, res) {
	var suscripcion = req.suscripcion ;

	suscripcion = _.extend(suscripcion , req.body);

	suscripcion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suscripcion);
		}
	});
};

/**
 * Delete an Suscripcion
 */
exports.delete = function(req, res) {
	var suscripcion = req.suscripcion ;

	suscripcion.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suscripcion);
		}
	});
};

/**
 * List of Suscripcions
 */
exports.list = function(req, res) { 
	Suscripcion.find().sort('-created').populate('user', 'displayName').exec(function(err, suscripcions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suscripcions);
		}
	});
};

/**
 * Suscripcion middleware
 */
exports.suscripcionByID = function(req, res, next, id) { 
	Suscripcion.findById(id).populate('user', 'displayName').exec(function(err, suscripcion) {
		if (err) return next(err);
		if (! suscripcion) return next(new Error('Failed to load Suscripcion ' + id));
		req.suscripcion = suscripcion ;
		next();
	});
};

/**
 * Suscripcion authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.suscripcion.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
