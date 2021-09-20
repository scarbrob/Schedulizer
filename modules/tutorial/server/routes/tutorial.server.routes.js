'use strict';

/**
 * Module dependencies
 */
var tutorialsPolicy = require('../policies/tutorial.server.policy'),
  tutorial = require('../controllers/tutorial.server.controller');

module.exports = function (app) {
  // Tutorial collection routes
  app.route('/api/tutorial').all(tutorialsPolicy.isAllowed)
    .get(tutorial.list)
    .post(tutorial.create);

  // Single tutorial routes
  app.route('/api/tutorial/:tutorialId').all(tutorialsPolicy.isAllowed)
    .get(tutorial.read)
    .put(tutorial.update)
    .delete(tutorial.delete);

  // Finish by binding the tutorial middleware
  app.param('tutorialId', tutorial.tutorialByID);
};
