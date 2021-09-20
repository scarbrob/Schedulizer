(function () {
  'use strict';

  angular
    .module('tutorial.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tutorial', {
        abstract: true,
        url: '/tutorial',
        template: '<ui-view/>'
      })
      .state('tutorial.list', {
        url: '',
        templateUrl: '/modules/tutorial/client/views/list-tutorial.client.view.html',
        controller: 'TutorialListController',
        controllerAs: 'vm'
      })
      .state('tutorial.view', {
        url: '/:tutorialId',
        templateUrl: '/modules/tutorial/client/views/view-tutorial.client.view.html',
        controller: 'TutorialController',
        controllerAs: 'vm',
        resolve: {
          tutorialResolve: getTutorial
        },
        data: {
          pageTitle: '{{ tutorialResolve.title }}'
        }
      });
  }

  getTutorial.$inject = ['$stateParams', 'TutorialService'];

  function getTutorial($stateParams, TutorialService) {
    return TutorialService.get({
      tutorialId: $stateParams.tutorialId
    }).$promise;
  }
}());
