(function () {
  'use strict';

  angular
    .module('tutorial')
    .controller('TutorialController', TutorialController);

  TutorialController.$inject = ['$scope', 'tutorialResolve', 'Authentication'];

  function TutorialController($scope, tutorial, Authentication) {
    var vm = this;

    vm.tutorial = tutorial;
    vm.authentication = Authentication;

  }
}());
