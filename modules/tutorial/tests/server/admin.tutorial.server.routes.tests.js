'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tutorial = mongoose.model('Tutorial'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  tutorial;

/**
 * Tutorial routes tests
 */
describe('Tutorial Admin CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new tutorial
    user.save()
      .then(function () {
        tutorial = {
          title: 'Tutorial Title',
          content: 'Tutorial Content'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an tutorial if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tutorial
        agent.post('/api/tutorials')
          .send(tutorial)
          .expect(200)
          .end(function (tutorialSaveErr, tutorialSaveRes) {
            // Handle tutorial save error
            if (tutorialSaveErr) {
              return done(tutorialSaveErr);
            }

            // Get a list of tutorials
            agent.get('/api/tutorials')
              .end(function (tutorialsGetErr, tutorialsGetRes) {
                // Handle tutorial save error
                if (tutorialsGetErr) {
                  return done(tutorialsGetErr);
                }

                // Get tutorials list
                var tutorials = tutorialsGetRes.body;

                // Set assertions
                (tutorials[0].user._id).should.equal(userId);
                (tutorials[0].title).should.match('Tutorial Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an tutorial if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tutorial
        agent.post('/api/tutorials')
          .send(tutorial)
          .expect(200)
          .end(function (tutorialSaveErr, tutorialSaveRes) {
            // Handle tutorial save error
            if (tutorialSaveErr) {
              return done(tutorialSaveErr);
            }

            // Update tutorial title
            tutorial.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing tutorial
            agent.put('/api/tutorials/' + tutorialSaveRes.body._id)
              .send(tutorial)
              .expect(200)
              .end(function (tutorialUpdateErr, tutorialUpdateRes) {
                // Handle tutorial update error
                if (tutorialUpdateErr) {
                  return done(tutorialUpdateErr);
                }

                // Set assertions
                (tutorialUpdateRes.body._id).should.equal(tutorialSaveRes.body._id);
                (tutorialUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an tutorial if no title is provided', function (done) {
    // Invalidate title field
    tutorial.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tutorial
        agent.post('/api/tutorials')
          .send(tutorial)
          .expect(422)
          .end(function (tutorialSaveErr, tutorialSaveRes) {
            // Set message assertion
            (tutorialSaveRes.body.message).should.match('Title cannot be blank');

            // Handle tutorial save error
            done(tutorialSaveErr);
          });
      });
  });

  it('should be able to delete an tutorial if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tutorial
        agent.post('/api/tutorials')
          .send(tutorial)
          .expect(200)
          .end(function (tutorialSaveErr, tutorialSaveRes) {
            // Handle tutorial save error
            if (tutorialSaveErr) {
              return done(tutorialSaveErr);
            }

            // Delete an existing tutorial
            agent.delete('/api/tutorials/' + tutorialSaveRes.body._id)
              .send(tutorial)
              .expect(200)
              .end(function (tutorialDeleteErr, tutorialDeleteRes) {
                // Handle tutorial error error
                if (tutorialDeleteErr) {
                  return done(tutorialDeleteErr);
                }

                // Set assertions
                (tutorialDeleteRes.body._id).should.equal(tutorialSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single tutorial if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new tutorial model instance
    tutorial.user = user;
    var tutorialObj = new Tutorial(tutorial);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tutorial
        agent.post('/api/tutorials')
          .send(tutorial)
          .expect(200)
          .end(function (tutorialSaveErr, tutorialSaveRes) {
            // Handle tutorial save error
            if (tutorialSaveErr) {
              return done(tutorialSaveErr);
            }

            // Get the tutorial
            agent.get('/api/tutorials/' + tutorialSaveRes.body._id)
              .expect(200)
              .end(function (tutorialInfoErr, tutorialInfoRes) {
                // Handle tutorial error
                if (tutorialInfoErr) {
                  return done(tutorialInfoErr);
                }

                // Set assertions
                (tutorialInfoRes.body._id).should.equal(tutorialSaveRes.body._id);
                (tutorialInfoRes.body.title).should.equal(tutorial.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (tutorialInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    Tutorial.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
