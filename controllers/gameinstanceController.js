var GameInstance = require('../models/gameinstance');
var Game = require('../models/game');
var Developer = require('../models/developer');
var Genre = require('../models/genre');
var async = require('async');

const {body,validationResult} = require('express-validator');

exports.gameinstance_list = function(req, res, next) {

    GameInstance.find()
      .populate('game')
      .exec(function (err, list_gameinstances) {
        if (err) { return next(err); }
        // Successful, so render
        res.render('gameinstance_list', { title: 'Game Instance List', gameinstance_list: list_gameinstances });
      });
  
  };

exports.gameinstance_detail = function(req, res, next) {

    GameInstance.findById(req.params.id)
    .populate('game')
    .exec(function (err, gameinstance) {
      if (err) { return next(err); }
      if (gameinstance==null) { // No results.
          var err = new Error('Game copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('gameinstance_detail', { title: 'Copy: '+gameinstance.game.title, gameinstance:  gameinstance});
    })

};

// Display GameInstance create form on GET.
exports.gameinstance_create_get = function(req, res) {
    Game.find({},'title')
    .exec(function (err, games) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('gameinstance_form', {title: 'Create GameInstance', game_list: games});
    });
};

// Handle GameInstance create on POST.
exports.gameinstance_create_post =  [
    // Validate and sanitise fields.
    body('game', 'Game must be specified').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a GameInstance object with escaped and trimmed data.
        var gameinstance = new GameInstance(
          { game: req.body.game,
            status: req.body.status,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Game.find({},'title')
                .exec(function (err, games) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('gameinstance_form', { title: 'Create GameInstance', game_list: games, selected_game: gameinstance.game._id , errors: errors.array(), gameinstance: gameinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            gameinstance.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(gameinstance.url);
                });
        }
    }
];

// Display GameInstance delete form on GET.
exports.gameinstance_delete_get = function(req, res) {
    GameInstance.findById(req.params.id)
    .populate('game')
    .exec(function (err, gameinstance) {
        if (err) { return next(err); }
        if (gameinstance==null) { // No results.
            res.redirect('/catalog/gameinstances');
        }
        // Successful, so render.
        res.render('gameinstance_delete', { title: 'Delete GameInstance', gameinstance:  gameinstance});
    })
};

// Handle GameInstance delete on POST.
exports.gameinstance_delete_post = function(req, res) {
    GameInstance.findByIdAndRemove(req.body.id, function deleteGameInstance(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of BookInstance items.
        res.redirect('/catalog/gameinstances');
        });
};

// Display GameInstance update form on GET.
exports.gameinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: GameInstance update GET');
};

// Handle gameinstance update on POST.
exports.gameinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: GameInstance update POST');
};