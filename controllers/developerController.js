var Developer = require('../models/developer');
var async = require('async');
var Game = require('../models/game');

const { body, validationResult } = require('express-validator');

exports.developer_list = function(req, res, next) {

    Developer.find()
      .sort([['name', 'ascending']])
      .exec(function (err, list_developers) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('developer_list', { title: 'Developer List', developer_list: list_developers });
      });
  
  };
  
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
        res.render('developer_detail', { title: 'Developer Detail', developer: results.developer, developer_games: results.developers_games } );
    });

};

// Display Developer create form on GET.
exports.developer_create_get = function(req, res) {
    res.render('developer_form', {title: 'Create Developer'});
};

// Handle Developer create on POST.
exports.developer_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Developer create POST');
};

exports.developer_create_post = [
    body('name').trim().isLength({ min:1 }).escape().withMessage('Name must be specified')
        .isAlphanumeric().withMessage('Name has non-alphanumeric characters'),
    body('date_established', 'Invalid date of establishment').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_shutdown', 'Invalid date of shutdown').optional({ checkFalsy: true}).isISO8601().toDate(),

    (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('developer_form', {title: 'Create Developer', developer: req.body, errors:errors.array() });
            return;
        }
        else {
            var developer = new Developer( {
                name: req.body.name,
                date_established: req.body.date_established,
                date_shutdown: req.body.date_shutdown
            });
            developer.save(function (err) {
                if (err) { return next(err); }
                res.redirect(developer.url);
            });
        }
    }
];

// Display Developer delete form on GET.
exports.developer_delete_get = function(req, res) {
    async.parallel({
        developer: function(callback) {
            Developer.findById(req.params.id).exec(callback)
        },
        developers_games: function(callback) {
          Game.find({ 'developer': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.developer==null) { // No results.
            res.redirect('/catalog/developers');
        }
        // Successful, so render.
        res.render('developer_delete', { title: 'Delete Developer', developer: results.developer, developer_games: results.developers_games } );
    });
};

// Handle Developer delete on POST.
exports.developer_delete_post = function(req, res) {
    async.parallel({
        developer: function(callback) {
          Developer.findById(req.body.developerid).exec(callback)
        },
        developers_games: function(callback) {
          Game.find({ 'developer': req.body.developerid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.developers_games.length > 0) {
            // Developer has gakes. Render in same way as for GET route.
            res.render('developer_delete', { title: 'Delete Developer', developer: results.developer, developer_games: results.developers_games } );
            return;
        }
        else {
            // Developer has no games. Delete object and redirect to the list of developers.
            Developer.findByIdAndRemove(req.body.developerid, function deleteDeveloper(err) {
                if (err) { return next(err); }
                // Success - go to developer list
                res.redirect('/catalog/developers')
            })
        }
    });
};

// Display Developer update form on GET.
exports.developer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: developer update GET');
};

// Handle Developer update on POST.
exports.developer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: developer update POST');
};