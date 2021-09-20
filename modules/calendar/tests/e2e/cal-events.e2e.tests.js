'use strict';

// this test will be called with
// gulp test:e2e

describe('Calendar E2E Tests:', function () {
  describe('Test calendar page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/calendar');
      expect(element.all(by.repeater('event in events')).count()).toEqual(0);
    });

    var CalendarController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CalendarService,
      newCourse;

    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CalendarService_) {
      $scope = $rootScope.$new();

      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CalendarService = _CalendarService_;

      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      newCourse = new CalendarService({
        _id: '525a8422f6d0f87f0e407a35',
        title: 'New Course',
        start: '2018-05-07T12:00:00',
        end: '2018-05-07T13:00:00',
        startT: '12:00:00',
        endT: '13:00:00',
        startD: '2018-05-07',
        endD: '2018-05-07',
        description: 'Test Course',
        className: ['Course'],
        stick: true,
        type: true
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the calendar controller.
      CalendarController = $controller('CalendarController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    it('should be able to add a course', function () {
      this.calEvents.addEvent(true, 'Test Course', '12:00:00', '13:00:00', 'Testing...', '2018-05-10', '2018-05-10');
      expect(this.calEvents[0]).toBe('Test Course');
    });

    it('should be able to delete a course', function () {
      this.calEvents.remove(0);
      expect(this.calEvents[0]).toBe(null);
    });

  });
});
