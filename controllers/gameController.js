var Game = require('../models/game');
var Developer = require('../models/developer');
var Genre = require('../models/genre');
var GameInstance = require('../models/gameinstance');

var async = require('async');

const {body, validationResult} = require('express-validator');

exports.index = function(req, res) {

    async.parallel({
        game_count: function(callback) {
            Game.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        game_instance_count: function(callback) {
            GameInstance.countDocuments({}, callback);
        },
        game_instance_available_count: function(callback) {
            GameInstance.countDocuments({status:'Available'}, callback);
        },
        developer_count: function(callback) {
            Developer.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'GameLibrary Home', error: err, data: results });
    });
};

// Display list of all games.
exports.game_list = function(req, res, next) {

    Game.find({}, 'title developer')
      .populate('developer')
      .exec(function (err, list_games) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('game_list', { title: 'Game List', game_list: list_games });
      });
  
  };

// Display detail page for a specific game.
exports.game_detail = function(req, res, next) {

    async.parallel({
        game: function(callback) {

            Game.findById(req.params.id)
              .populate('developer')
              .populate('genre')
              .exec(callback);
        },
        game_instance: function(callback) {

          GameInstance.find({ 'game': req.params.id })
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.game==null) { // No results.
            var err = new Error('Game not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('game_detail', { title: results.game.title, game: results.game, game_instances: results.game_instance } );
    });

};

// Display game create form on GET.
exports.game_create_get = function(req, res) {
    async.parallel({
        developers: function(callback) {
            Developer.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('game_form', { title: 'Create Game', developers: results.developers, genres: results.genres });
    });
};

// Handle game create on POST.
exports.game_create_post = [
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre ==='undefined')
            req.body.genre = [];
            else
            req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitise fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('developer', 'Developer must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        var game = new Game(
          { title: req.body.title,
            developer: req.body.developer,
            summary: req.body.summary,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            console.log(errors);
            async.parallel({
                developers: function(callback) {
                    Developer.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (game.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('game_form', { title: 'Create Game',developers:results.developers, genres:results.genres, game: game, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save game.
            game.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new game record.
                   res.redirect(game.url);
                });
        }
    }
];

// Display game delete form on GET.
exports.game_delete_get = function(req, res) {
    async.parallel({
        game: function(callback) {
            Game.findById(req.params.id).populate('developer').populate('genre').exec(callback);
        },
        game_gameinstances: function(callback) {
            GameInstance.find({ 'game': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.game==null) { // No results.
            res.redirect('/catalog/games');
        }
        // Successful, so render.
        res.render('game_delete', { title: 'Delete Game', game: results.game, game_instances: results.game_gameinstances } );
    });

};

// Handle game delete on POST.
exports.game_delete_post = function(req, res) {
    async.parallel({
        game: function(callback) {
            Game.findById(req.body.id).populate('developer').populate('genre').exec(callback);
        },
        game_gameinstances: function(callback) {
            GameInstance.find({ 'game': req.body.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.game_gameinstances.length > 0) {
            // Game has game_instances. Render in same way as for GET route.
            res.render('game_delete', { title: 'Delete Game', game: results.game, game_instances: results.game_gameinstances } );
            return;
        }
        else {
            // Game has no GameInstance objects. Delete object and redirect to the list of games.
            Game.findByIdAndRemove(req.body.id, function deleteGame(err) {
                if (err) { return next(err); }
                // Success - got to games list.
                res.redirect('/catalog/games');
            });

        }
    });
};

// Display game update form on GET.
exports.game_update_get = function(req, res) {
    async.parallel({
        game: function(callback) {
            Game.findById(req.params.id).populate('developer').populate('genre').exec(callback);
        },
        developers: function(callback) {
            Developer.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.game==null) { // No results.
                var err = new Error('Game not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
                for (var game_g_iter = 0; game_g_iter < results.game.genre.length; game_g_iter++) {
                    if (results.genres[all_g_iter]._id.toString()===results.game.genre[game_g_iter]._id.toString()) {
                        results.genres[all_g_iter].checked='true';
                    }
                }
            }
            res.render('game_form', { title: 'Update Game', developers: results.developers, genres: results.genres, game: results.game });
        });
};

// Handle game update on POST.
exports.game_update_post = function(req, res) {
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitise fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('developer', 'Developer must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Game object with escaped/trimmed data and old id.
        var game = new Game(
          { title: req.body.title,
            developer: req.body.developer,
            summary: req.body.summary,
            genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                developers: function(callback) {
                    Developer.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (game.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('game_form', { title: 'Update Game',developers: results.developers, genres: results.genres, game: game, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Game.findByIdAndUpdate(req.params.id, game, {}, function (err,thegame) {
                if (err) { return next(err); }
                   // Successful - redirect to game detail page.
                   res.redirect(thegame.url);
                });
        }
    }
};