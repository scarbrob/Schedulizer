(function () {
  'use strict';

  angular
    .module('tutorial.admin')
    .controller('TutorialAdminController', TutorialAdminController);

  TutorialAdminController.$inject = ['$scope', '$state', '$window', 'tutorialResolve', 'Authentication', 'Notification'];

  function TutorialAdminController($scope, $state, $window, tutorial, Authentication, Notification) {
    var vm = this;

    vm.tutorial = tutorial;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing tutorial
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.tutorial.$remove(function () {
          $state.go('admin.tutorial.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tutorial deleted successfully!' });
        });
      }
    }

    // Save tutorial
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tutorialForm');
        return false;
      }

      // Create a new tutorial, or update the current instance
      vm.tutorial.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.tutorial.list'); // should we send the User to the list or the updated tutorial's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tutorial saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Tutorial save error!' });
      }
    }
  }
}());
