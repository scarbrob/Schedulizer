(function () {
  'use strict';

  describe('Tutorial Route Tests', function () {
    // Initialize global variables
    var $scope,
      TutorialService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TutorialService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TutorialService = _TutorialService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.tutorial');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tutorial');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.tutorial.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/tutorial/client/views/admin/list-tutorial.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TutorialAdminController,
          mockTutorial;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.tutorial.create');
          $templateCache.put('/modules/tutorial/client/views/admin/form-tutorial.client.view.html', '');

          // Create mock tutorial
          mockTutorial = new TutorialService();

          // Initialize Controller
          TutorialAdminController = $controller('TutorialAdminController as vm', {
            $scope: $scope,
            tutorialResolve: mockTutorial
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.tutorialResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/tutorial/create');
        }));

        it('should attach an tutorial to the controller scope', function () {
          expect($scope.vm.tutorial._id).toBe(mockTutorial._id);
          expect($scope.vm.tutorial._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/tutorial/client/views/admin/form-tutorial.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TutorialAdminController,
          mockTutorial;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.tutorial.edit');
          $templateCache.put('/modules/tutorial/client/views/admin/form-tutorial.client.view.html', '');

          // Create mock tutorial
          mockTutorial = new TutorialService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Tutorial about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TutorialAdminController = $controller('TutorialAdminController as vm', {
            $scope: $scope,
            tutorialResolve: mockTutorial
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:tutorialId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.tutorialResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            tutorialId: 1
          })).toEqual('/admin/tutorial/1/edit');
        }));

        it('should attach an tutorial to the controller scope', function () {
          expect($scope.vm.tutorial._id).toBe(mockTutorial._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/tutorial/client/views/admin/form-tutorial.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
