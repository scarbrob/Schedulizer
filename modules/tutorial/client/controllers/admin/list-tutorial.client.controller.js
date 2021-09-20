(function () {
  'use strict';

  angular
    .module('tutorial.admin')
    .controller('TutorialAdminListController', TutorialAdminListController);

  TutorialAdminListController.$inject = ['TutorialService'];

  function TutorialAdminListController(TutorialService) {
    var vm = this;

    vm.tutorial = TutorialService.query();
  }
}());
