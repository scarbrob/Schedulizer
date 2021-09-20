(function () {
  'use strict';

  angular
    .module('tutorial.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.tutorial', {
        abstract: true,
        url: '/tutorial',
        template: '<ui-view/>'
      })
      .state('admin.tutorial.list', {
        url: '',
        templateUrl: '/modules/tutorial/client/views/admin/list-tutorial.client.view.html',
        controller: 'TutorialAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.tutorial.create', {
        url: '/create',
        templateUrl: '/modules/tutorial/client/views/admin/form-tutorial.client.view.html',
        controller: 'TutorialAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          tutorialResolve: newTutorial
        }
      })
      .state('admin.tutorial.edit', {
        url: '/:tutorialId/edit',
        templateUrl: '/modules/tutorial/client/views/admin/form-tutorial.client.view.html',
        controller: 'TutorialAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ tutorialResolve.title }}'
        },
        resolve: {
          tutorialResolve: getTutorial
        }
      });
  }

  getTutorial.$inject = ['$stateParams', 'TutorialService'];

  function getTutorial($stateParams, TutorialService) {
    return TutorialService.get({
      tutorialId: $stateParams.tutorialId
    }).$promise;
  }

  newTutorial.$inject = ['TutorialService'];

  function newTutorial(TutorialService) {
    return new TutorialService();
  }
}());
