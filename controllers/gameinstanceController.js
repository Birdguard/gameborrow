var GameInstance = require('../models/gameinstance');

// Display list of all BookInstances.
// exports.gameinstance_list = function(req, res) {
//     res.send('NOT IMPLEMENTED: BookInstance list');
// };

exports.gameinstance_list = function(req, res, next) {

    GameInstance.find()
      .populate('game')
      .exec(function (err, list_gameinstances) {
        if (err) { return next(err); }
        // Successful, so render
        res.render('gameinstance_list', { title: 'Game Instance List', gameinstance_list: list_gameinstances });
      });
  
  };

// Display detail page for a specific BookInstance.
// exports.gameinstance_detail = function(req, res) {
//     res.send('NOT IMPLEMENTED: BookInstance detail: ' + req.params.id);
// };

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

// Display BookInstance create form on GET.
exports.gameinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.gameinstance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET.
exports.gameinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.gameinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.gameinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.gameinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};