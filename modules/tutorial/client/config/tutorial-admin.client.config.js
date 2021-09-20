(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('tutorial.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Tutorial',
      state: 'admin.tutorial.list'
    });
  }
}());
