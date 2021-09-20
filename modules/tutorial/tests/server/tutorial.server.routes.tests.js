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
describe('Tutorial CRUD tests', function () {

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

  it('should not be able to save an tutorial if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tutorials')
          .send(tutorial)
          .expect(403)
          .end(function (tutorialSaveErr, tutorialSaveRes) {
            // Call the assertion callback
            done(tutorialSaveErr);
          });

      });
  });

  it('should not be able to save an tutorial if not logged in', function (done) {
    agent.post('/api/tutorials')
      .send(tutorial)
      .expect(403)
      .end(function (tutorialSaveErr, tutorialSaveRes) {
        // Call the assertion callback
        done(tutorialSaveErr);
      });
  });

  it('should not be able to update an tutorial if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tutorials')
          .send(tutorial)
          .expect(403)
          .end(function (tutorialSaveErr, tutorialSaveRes) {
            // Call the assertion callback
            done(tutorialSaveErr);
          });
      });
  });

  it('should be able to get a list of tutorials if not signed in', function (done) {
    // Create new tutorial model instance
    var tutorialObj = new Tutorial(tutorial);

    // Save the tutorial
    tutorialObj.save(function () {
      // Request tutorials
      agent.get('/api/tutorials')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single tutorial if not signed in', function (done) {
    // Create new tutorial model instance
    var tutorialObj = new Tutorial(tutorial);

    // Save the tutorial
    tutorialObj.save(function () {
      agent.get('/api/tutorials/' + tutorialObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', tutorial.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single tutorial with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/tutorials/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tutorial is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single tutorial which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent tutorial
    agent.get('/api/tutorials/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No tutorial with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an tutorial if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tutorials')
          .send(tutorial)
          .expect(403)
          .end(function (tutorialSaveErr, tutorialSaveRes) {
            // Call the assertion callback
            done(tutorialSaveErr);
          });
      });
  });

  it('should not be able to delete an tutorial if not signed in', function (done) {
    // Set tutorial user
    tutorial.user = user;

    // Create new tutorial model instance
    var tutorialObj = new Tutorial(tutorial);

    // Save the tutorial
    tutorialObj.save(function () {
      // Try deleting tutorial
      agent.delete('/api/tutorials/' + tutorialObj._id)
        .expect(403)
        .end(function (tutorialDeleteErr, tutorialDeleteRes) {
          // Set message assertion
          (tutorialDeleteRes.body.message).should.match('User is not authorized');

          // Handle tutorial error error
          done(tutorialDeleteErr);
        });

    });
  });

  it('should be able to get a single tutorial that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new tutorial
          agent.post('/api/tutorials')
            .send(tutorial)
            .expect(200)
            .end(function (tutorialSaveErr, tutorialSaveRes) {
              // Handle tutorial save error
              if (tutorialSaveErr) {
                return done(tutorialSaveErr);
              }

              // Set assertions on new tutorial
              (tutorialSaveRes.body.title).should.equal(tutorial.title);
              should.exist(tutorialSaveRes.body.user);
              should.equal(tutorialSaveRes.body.user._id, orphanId);

              // force the tutorial to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
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
                        should.equal(tutorialInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single tutorial if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new tutorial model instance
    var tutorialObj = new Tutorial(tutorial);

    // Save the tutorial
    tutorialObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/tutorials/' + tutorialObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', tutorial.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single tutorial, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'tutorialowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Tutorial
    var _tutorialOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _tutorialOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Tutorial
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new tutorial
          agent.post('/api/tutorials')
            .send(tutorial)
            .expect(200)
            .end(function (tutorialSaveErr, tutorialSaveRes) {
              // Handle tutorial save error
              if (tutorialSaveErr) {
                return done(tutorialSaveErr);
              }

              // Set assertions on new tutorial
              (tutorialSaveRes.body.title).should.equal(tutorial.title);
              should.exist(tutorialSaveRes.body.user);
              should.equal(tutorialSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (tutorialInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
