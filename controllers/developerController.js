var Developer = require('../models/developer');
var async = require('async');
var Game = require('../models/game');

// Display list of all Authors.
// exports.developer_list = function(req, res) {
//     res.send('NOT IMPLEMENTED: Developer list');
// };

exports.developer_list = function(req, res, next) {

    Developer.find()
      .sort([['name', 'ascending']])
      .exec(function (err, list_developers) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('developer_list', { title: 'Developer List', developer_list: list_developers });
      });
  
  };
  

// Display detail page for a specific Author.
// exports.developer_detail = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
// };

exports.developer_detail = function(req, res, next) {

    async.parallel({
        developer: function(callback) {
            Developer.findById(req.params.id)
              .exec(callback)
        },
        developers_games: function(callback) {
          Game.find({ 'developer': req.params.id },'title summary')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.developer==null) { // No results.
            var err = new Error('Developer not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('developer_detail', { title: 'Developer Detail', developer: results.developer, developers_games: results.developers_games } );
    });

};

// Display Author create form on GET.
exports.developer_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.developer_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.developer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.developer_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.developer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.developer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};