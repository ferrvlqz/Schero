'use strict';

(function() {
	// Suscripcions Controller Spec
	describe('Suscripcions Controller Tests', function() {
		// Initialize global variables
		var SuscripcionsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Suscripcions controller.
			SuscripcionsController = $controller('SuscripcionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Suscripcion object fetched from XHR', inject(function(Suscripcions) {
			// Create sample Suscripcion using the Suscripcions service
			var sampleSuscripcion = new Suscripcions({
				name: 'New Suscripcion'
			});

			// Create a sample Suscripcions array that includes the new Suscripcion
			var sampleSuscripcions = [sampleSuscripcion];

			// Set GET response
			$httpBackend.expectGET('suscripcions').respond(sampleSuscripcions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.suscripcions).toEqualData(sampleSuscripcions);
		}));

		it('$scope.findOne() should create an array with one Suscripcion object fetched from XHR using a suscripcionId URL parameter', inject(function(Suscripcions) {
			// Define a sample Suscripcion object
			var sampleSuscripcion = new Suscripcions({
				name: 'New Suscripcion'
			});

			// Set the URL parameter
			$stateParams.suscripcionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/suscripcions\/([0-9a-fA-F]{24})$/).respond(sampleSuscripcion);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.suscripcion).toEqualData(sampleSuscripcion);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Suscripcions) {
			// Create a sample Suscripcion object
			var sampleSuscripcionPostData = new Suscripcions({
				name: 'New Suscripcion'
			});

			// Create a sample Suscripcion response
			var sampleSuscripcionResponse = new Suscripcions({
				_id: '525cf20451979dea2c000001',
				name: 'New Suscripcion'
			});

			// Fixture mock form input values
			scope.name = 'New Suscripcion';

			// Set POST response
			$httpBackend.expectPOST('suscripcions', sampleSuscripcionPostData).respond(sampleSuscripcionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Suscripcion was created
			expect($location.path()).toBe('/suscripcions/' + sampleSuscripcionResponse._id);
		}));

		it('$scope.update() should update a valid Suscripcion', inject(function(Suscripcions) {
			// Define a sample Suscripcion put data
			var sampleSuscripcionPutData = new Suscripcions({
				_id: '525cf20451979dea2c000001',
				name: 'New Suscripcion'
			});

			// Mock Suscripcion in scope
			scope.suscripcion = sampleSuscripcionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/suscripcions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/suscripcions/' + sampleSuscripcionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid suscripcionId and remove the Suscripcion from the scope', inject(function(Suscripcions) {
			// Create new Suscripcion object
			var sampleSuscripcion = new Suscripcions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Suscripcions array and include the Suscripcion
			scope.suscripcions = [sampleSuscripcion];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/suscripcions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSuscripcion);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.suscripcions.length).toBe(0);
		}));
	});
}());