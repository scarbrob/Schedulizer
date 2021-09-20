(function () {
  'use strict';

  angular
    .module('tutorial')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Tutorial',
      state: 'tutorial',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'tutorial', {
      title: 'List Tutorial',
      state: 'tutorial.list',
      roles: ['*']
    });
  }
}());
