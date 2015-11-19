'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Contacto = mongoose.model('Contacto'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, contacto;

/**
 * Contacto routes tests
 */
describe('Contacto CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Contacto
		user.save(function() {
			contacto = {
				name: 'Contacto Name'
			};

			done();
		});
	});

	it('should be able to save Contacto instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contacto
				agent.post('/contactos')
					.send(contacto)
					.expect(200)
					.end(function(contactoSaveErr, contactoSaveRes) {
						// Handle Contacto save error
						if (contactoSaveErr) done(contactoSaveErr);

						// Get a list of Contactos
						agent.get('/contactos')
							.end(function(contactosGetErr, contactosGetRes) {
								// Handle Contacto save error
								if (contactosGetErr) done(contactosGetErr);

								// Get Contactos list
								var contactos = contactosGetRes.body;

								// Set assertions
								(contactos[0].user._id).should.equal(userId);
								(contactos[0].name).should.match('Contacto Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Contacto instance if not logged in', function(done) {
		agent.post('/contactos')
			.send(contacto)
			.expect(401)
			.end(function(contactoSaveErr, contactoSaveRes) {
				// Call the assertion callback
				done(contactoSaveErr);
			});
	});

	it('should not be able to save Contacto instance if no name is provided', function(done) {
		// Invalidate name field
		contacto.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contacto
				agent.post('/contactos')
					.send(contacto)
					.expect(400)
					.end(function(contactoSaveErr, contactoSaveRes) {
						// Set message assertion
						(contactoSaveRes.body.message).should.match('Please fill Contacto name');
						
						// Handle Contacto save error
						done(contactoSaveErr);
					});
			});
	});

	it('should be able to update Contacto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contacto
				agent.post('/contactos')
					.send(contacto)
					.expect(200)
					.end(function(contactoSaveErr, contactoSaveRes) {
						// Handle Contacto save error
						if (contactoSaveErr) done(contactoSaveErr);

						// Update Contacto name
						contacto.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Contacto
						agent.put('/contactos/' + contactoSaveRes.body._id)
							.send(contacto)
							.expect(200)
							.end(function(contactoUpdateErr, contactoUpdateRes) {
								// Handle Contacto update error
								if (contactoUpdateErr) done(contactoUpdateErr);

								// Set assertions
								(contactoUpdateRes.body._id).should.equal(contactoSaveRes.body._id);
								(contactoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Contactos if not signed in', function(done) {
		// Create new Contacto model instance
		var contactoObj = new Contacto(contacto);

		// Save the Contacto
		contactoObj.save(function() {
			// Request Contactos
			request(app).get('/contactos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Contacto if not signed in', function(done) {
		// Create new Contacto model instance
		var contactoObj = new Contacto(contacto);

		// Save the Contacto
		contactoObj.save(function() {
			request(app).get('/contactos/' + contactoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', contacto.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Contacto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contacto
				agent.post('/contactos')
					.send(contacto)
					.expect(200)
					.end(function(contactoSaveErr, contactoSaveRes) {
						// Handle Contacto save error
						if (contactoSaveErr) done(contactoSaveErr);

						// Delete existing Contacto
						agent.delete('/contactos/' + contactoSaveRes.body._id)
							.send(contacto)
							.expect(200)
							.end(function(contactoDeleteErr, contactoDeleteRes) {
								// Handle Contacto error error
								if (contactoDeleteErr) done(contactoDeleteErr);

								// Set assertions
								(contactoDeleteRes.body._id).should.equal(contactoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Contacto instance if not signed in', function(done) {
		// Set Contacto user 
		contacto.user = user;

		// Create new Contacto model instance
		var contactoObj = new Contacto(contacto);

		// Save the Contacto
		contactoObj.save(function() {
			// Try deleting Contacto
			request(app).delete('/contactos/' + contactoObj._id)
			.expect(401)
			.end(function(contactoDeleteErr, contactoDeleteRes) {
				// Set message assertion
				(contactoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Contacto error error
				done(contactoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Contacto.remove().exec();
		done();
	});
});