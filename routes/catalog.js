var express = require('express');
var router = express.Router();

// Require controller modules.
var game_controller = require('../controllers/gameController');
var developer_controller = require('../controllers/developerController');
var genre_controller = require('../controllers/genreController');
var game_instance_controller = require('../controllers/gameinstanceController');

/// GAME ROUTES ///

// GET catalog home page.
router.get('/', game_controller.index);

// GET request for creating a Game. NOTE This must come before routes that display Game (uses id).
router.get('/game/create', game_controller.game_create_get);

// POST request for creating Game.
router.post('/game/create', game_controller.game_create_post);

// GET request to delete Game.
router.get('/game/:id/delete', game_controller.game_delete_get);

// POST request to delete Game.
router.post('/game/:id/delete', game_controller.game_delete_post);

// GET request to update Game.
router.get('/game/:id/update', game_controller.game_update_get);

// POST request to update Game.
router.post('/game/:id/update', game_controller.game_update_post);

// GET request for one Game.
router.get('/game/:id', game_controller.game_detail);

// GET request for list of all game items.
router.get('/games', game_controller.game_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/developer/create', developer_controller.developer_create_get);

// POST request for creating Author.
router.post('/developer/create', developer_controller.developer_create_post);

// GET request to delete Author.
router.get('/developer/:id/delete', developer_controller.developer_delete_get);

// POST request to delete Author.
router.post('/developer/:id/delete', developer_controller.developer_delete_post);

// GET request to update Author.
router.get('/developer/:id/update', developer_controller.developer_update_get);

// POST request to update Author.
router.post('/developer/:id/update', developer_controller.developer_update_post);

// GET request for one Author.
router.get('/developer/:id', developer_controller.developer_detail);

// GET request for list of all Authors.
router.get('/developers', developer_controller.developer_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// GAMEINSTANCE ROUTES ///

// GET request for creating a GameInstance. NOTE This must come before route that displays GameInstance (uses id).
router.get('/gameinstance/create', game_instance_controller.gameinstance_create_get);

// POST request for creating GameInstance.
router.post('/gameinstance/create', game_instance_controller.gameinstance_create_post);

// GET request to delete GameInstance.
router.get('/gameinstance/:id/delete', game_instance_controller.gameinstance_delete_get);

// POST request to delete GameInstance.
router.post('/gameinstance/:id/delete', game_instance_controller.gameinstance_delete_post);

// GET request to update GameInstance.
router.get('/gameinstance/:id/update', game_instance_controller.gameinstance_update_get);

// POST request to update GameInstance.
router.post('/gameinstance/:id/update', game_instance_controller.gameinstance_update_post);

// GET request for one GameInstance.
router.get('/gameinstance/:id', game_instance_controller.gameinstance_detail);

// GET request for list of all GameInstance.
router.get('/gameinstances', game_instance_controller.gameinstance_list);

module.exports = router;