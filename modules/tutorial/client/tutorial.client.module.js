(function (app) {
  'use strict';

  app.registerModule('tutorial', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('tutorial.admin', ['core.admin']);
  app.registerModule('tutorial.admin.routes', ['core.admin.routes']);
  app.registerModule('tutorial.services');
  app.registerModule('tutorial.routes', ['ui.router', 'core.routes', 'tutorial.services']);
}(ApplicationConfiguration));
