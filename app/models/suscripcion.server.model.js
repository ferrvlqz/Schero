'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Suscripcion Schema
 */
var SuscripcionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Suscripcion name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Suscripcion', SuscripcionSchema);