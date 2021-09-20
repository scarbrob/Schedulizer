'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tutorial = mongoose.model('Tutorial'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an tutorial
 */
exports.create = function (req, res) {
  var tutorial = new Tutorial(req.body);
  tutorial.user = req.user;

  tutorial.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tutorial);
    }
  });
};

/**
 * Show the current tutorial
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var tutorial = req.tutorial ? req.tutorial.toJSON() : {};

  // Add a custom field to the Tutorial, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Tutorial model.
  tutorial.isCurrentUserOwner = !!(req.user && tutorial.user && tutorial.user._id.toString() === req.user._id.toString());

  res.json(tutorial);
};

/**
 * Update an tutorial
 */
exports.update = function (req, res) {
  var tutorial = req.tutorial;

  tutorial.title = req.body.title;
  tutorial.content = req.body.content;

  tutorial.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tutorial);
    }
  });
};

/**
 * Delete an tutorial
 */
exports.delete = function (req, res) {
  var tutorial = req.tutorial;

  tutorial.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tutorial);
    }
  });
};

/**
 * List of Tutorial
 */
exports.list = function (req, res) {
  Tutorial.find().sort('-created').populate('user', 'displayName').exec(function (err, tutorial) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tutorial);
    }
  });
};

/**
 * Tutorial middleware
 */
exports.tutorialByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tutorial is invalid'
    });
  }

  Tutorial.findById(id).populate('user', 'displayName').exec(function (err, tutorial) {
    if (err) {
      return next(err);
    } else if (!tutorial) {
      return res.status(404).send({
        message: 'No tutorial with that identifier has been found'
      });
    }
    req.tutorial = tutorial;
    next();
  });
};
