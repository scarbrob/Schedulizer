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
          mainstate = $state.get('tutorial');
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
          liststate = $state.get('tutorial.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/tutorial/client/views/list-tutorial.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TutorialController,
          mockTutorial;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tutorial.view');
          $templateCache.put('/modules/tutorial/client/views/view-tutorial.client.view.html', '');

          // create mock tutorial
          mockTutorial = new TutorialService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Tutorial about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TutorialController = $controller('TutorialController as vm', {
            $scope: $scope,
            tutorialResolve: mockTutorial
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:tutorialId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.tutorialResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            tutorialId: 1
          })).toEqual('/tutorial/1');
        }));

        it('should attach an tutorial to the controller scope', function () {
          expect($scope.vm.tutorial._id).toBe(mockTutorial._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/tutorial/client/views/view-tutorial.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/tutorial/client/views/list-tutorial.client.view.html', '');

          $state.go('tutorial.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('tutorial/');
          $rootScope.$digest();

          expect($location.path()).toBe('/tutorial');
          expect($state.current.templateUrl).toBe('/modules/tutorial/client/views/list-tutorial.client.view.html');
        }));
      });
    });
  });
}());
