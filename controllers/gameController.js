var Game = require('../models/game');
var Developer = require('../models/developer');
var Genre = require('../models/genre');
var GameInstance = require('../models/gameinstance');

var async = require('async');

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

// Display list of all books.
// exports.game_list = function(req, res) {
//     res.send('NOT IMPLEMENTED: Book list');
// };

// Display list of all Books.
exports.game_list = function(req, res, next) {

    Game.find({}, 'title developer')
      .populate('developer')
      .exec(function (err, list_games) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('game_list', { title: 'Game List', game_list: list_games });
      });
  
  };

// Display detail page for a specific book.
// exports.game_detail = function(req, res) {
//     res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
// };

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

// Display book create form on GET.
exports.game_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.game_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.game_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.game_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.game_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.game_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};