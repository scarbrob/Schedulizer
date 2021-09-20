(function () {
  'use strict';

  angular
    .module('tutorial.services')
    .factory('TutorialService', TutorialService);

  TutorialService.$inject = ['$resource', '$log'];

  function TutorialService($resource, $log) {
    var Tutorial = $resource('/api/tutorial/:tutorialId', {
      tutorialId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Tutorial.prototype, {
      createOrUpdate: function () {
        var tutorial = this;
        return createOrUpdate(tutorial);
      }
    });

    return Tutorial;

    function createOrUpdate(tutorial) {
      if (tutorial._id) {
        return tutorial.$update(onSuccess, onError);
      } else {
        return tutorial.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(tutorial) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
