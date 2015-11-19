'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Suscripcion = mongoose.model('Suscripcion'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, suscripcion;

/**
 * Suscripcion routes tests
 */
describe('Suscripcion CRUD tests', function() {
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

		// Save a user to the test db and create new Suscripcion
		user.save(function() {
			suscripcion = {
				name: 'Suscripcion Name'
			};

			done();
		});
	});

	it('should be able to save Suscripcion instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Suscripcion
				agent.post('/suscripcions')
					.send(suscripcion)
					.expect(200)
					.end(function(suscripcionSaveErr, suscripcionSaveRes) {
						// Handle Suscripcion save error
						if (suscripcionSaveErr) done(suscripcionSaveErr);

						// Get a list of Suscripcions
						agent.get('/suscripcions')
							.end(function(suscripcionsGetErr, suscripcionsGetRes) {
								// Handle Suscripcion save error
								if (suscripcionsGetErr) done(suscripcionsGetErr);

								// Get Suscripcions list
								var suscripcions = suscripcionsGetRes.body;

								// Set assertions
								(suscripcions[0].user._id).should.equal(userId);
								(suscripcions[0].name).should.match('Suscripcion Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Suscripcion instance if not logged in', function(done) {
		agent.post('/suscripcions')
			.send(suscripcion)
			.expect(401)
			.end(function(suscripcionSaveErr, suscripcionSaveRes) {
				// Call the assertion callback
				done(suscripcionSaveErr);
			});
	});

	it('should not be able to save Suscripcion instance if no name is provided', function(done) {
		// Invalidate name field
		suscripcion.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Suscripcion
				agent.post('/suscripcions')
					.send(suscripcion)
					.expect(400)
					.end(function(suscripcionSaveErr, suscripcionSaveRes) {
						// Set message assertion
						(suscripcionSaveRes.body.message).should.match('Please fill Suscripcion name');
						
						// Handle Suscripcion save error
						done(suscripcionSaveErr);
					});
			});
	});

	it('should be able to update Suscripcion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Suscripcion
				agent.post('/suscripcions')
					.send(suscripcion)
					.expect(200)
					.end(function(suscripcionSaveErr, suscripcionSaveRes) {
						// Handle Suscripcion save error
						if (suscripcionSaveErr) done(suscripcionSaveErr);

						// Update Suscripcion name
						suscripcion.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Suscripcion
						agent.put('/suscripcions/' + suscripcionSaveRes.body._id)
							.send(suscripcion)
							.expect(200)
							.end(function(suscripcionUpdateErr, suscripcionUpdateRes) {
								// Handle Suscripcion update error
								if (suscripcionUpdateErr) done(suscripcionUpdateErr);

								// Set assertions
								(suscripcionUpdateRes.body._id).should.equal(suscripcionSaveRes.body._id);
								(suscripcionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Suscripcions if not signed in', function(done) {
		// Create new Suscripcion model instance
		var suscripcionObj = new Suscripcion(suscripcion);

		// Save the Suscripcion
		suscripcionObj.save(function() {
			// Request Suscripcions
			request(app).get('/suscripcions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Suscripcion if not signed in', function(done) {
		// Create new Suscripcion model instance
		var suscripcionObj = new Suscripcion(suscripcion);

		// Save the Suscripcion
		suscripcionObj.save(function() {
			request(app).get('/suscripcions/' + suscripcionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', suscripcion.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Suscripcion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Suscripcion
				agent.post('/suscripcions')
					.send(suscripcion)
					.expect(200)
					.end(function(suscripcionSaveErr, suscripcionSaveRes) {
						// Handle Suscripcion save error
						if (suscripcionSaveErr) done(suscripcionSaveErr);

						// Delete existing Suscripcion
						agent.delete('/suscripcions/' + suscripcionSaveRes.body._id)
							.send(suscripcion)
							.expect(200)
							.end(function(suscripcionDeleteErr, suscripcionDeleteRes) {
								// Handle Suscripcion error error
								if (suscripcionDeleteErr) done(suscripcionDeleteErr);

								// Set assertions
								(suscripcionDeleteRes.body._id).should.equal(suscripcionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Suscripcion instance if not signed in', function(done) {
		// Set Suscripcion user 
		suscripcion.user = user;

		// Create new Suscripcion model instance
		var suscripcionObj = new Suscripcion(suscripcion);

		// Save the Suscripcion
		suscripcionObj.save(function() {
			// Try deleting Suscripcion
			request(app).delete('/suscripcions/' + suscripcionObj._id)
			.expect(401)
			.end(function(suscripcionDeleteErr, suscripcionDeleteRes) {
				// Set message assertion
				(suscripcionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Suscripcion error error
				done(suscripcionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Suscripcion.remove().exec();
		done();
	});
});