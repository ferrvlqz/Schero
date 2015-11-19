'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Contacto Schema
 */
var ContactoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Contacto name',
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

mongoose.model('Contacto', ContactoSchema);