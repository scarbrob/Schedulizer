(function () {
  'use strict';

  angular
    .module('tutorial')
    .controller('TutorialListController', TutorialListController);

  TutorialListController.$inject = ['TutorialService'];

  function TutorialListController(TutorialService) {
    var vm = this;

    vm.tutorial = TutorialService.query();
  }
}());
