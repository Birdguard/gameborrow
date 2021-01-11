#! /usr/bin/env node

console.log('This script populates some test games, developers, genres and gameinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Game = require('./models/game')
var Developer = require('./models/developer')
var Genre = require('./models/genre')
var GameInstance = require('./models/gameinstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var developers = []
var genres = []
var games = []
var gameinstances = []

function developerCreate(name, date_est, date_shut, cb) {
  developerdetail = {name:name}
  if (date_est != false) developerdetail.date_established = date_est
  if (date_shut != false) authordetail.date_shutdown = date_shut
  
  var developer = new Developer(developerdetail);
       
  developer.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Developer: ' + developer);
    developers.push(developer)
    cb(null, developer)
  }  );
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function gameCreate(title, summary, developer, genre, cb) {
  gamedetail = { 
    title: title,
    summary: summary,
    developer: developer
  }
  if (genre != false) gamedetail.genre = genre
    
  var game = new Game(gamedetail);    
  game.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Game: ' + game);
    games.push(game)
    cb(null, game)
  }  );
}


function gameInstanceCreate(game, due_back, status, cb) {
  gameinstancedetail = { 
    game: game,
  }    
  if (due_back != false) gameinstancedetail.due_back = due_back
  if (status != false) gameinstancedetail.status = status
    
  var gameinstance = new GameInstance(gameinstancedetail);    
  gameinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING GameInstance: ' + gameinstance);
      cb(err, null)
      return
    }
    console.log('New GameInstance: ' + gameinstance);
    gameinstances.push(gameinstance)
    cb(null, game)
  }  );
}


function createGenreAuthors(cb) {
    async.series([
        function(callback) {
          developerCreate('Naughty Dog', '1984-09-27', false, callback);
        },
        function(callback) {
          developerCreate('Bungie', '1991-06-19', false, callback);
        },
        function(callback) {
          developerCreate('Riot', '2006-08-31',false, callback);
        },
        function(callback) {
          developerCreate('EA', '1982-05-27', false, callback);
        },
        function(callback) {
          developerCreate('Sucker Punch', '1997-10-16', false, callback);
        },
        function(callback) {
          genreCreate("RPG", callback);
        },
        function(callback) {
          genreCreate("FPS", callback);
        },
        function(callback) {
          genreCreate("Strategy", callback);
        },
        ],
        // optional callback
        cb);
}


function createGames(cb) {
    async.parallel([
        function(callback) {
          gameCreate('The Last of Us', 'The Last of Us is a 2013 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment. Players control Joel, a smuggler tasked with escorting a teenage girl, Ellie, across a post-apocalyptic United States.', developers[0], [genres[0],], callback);
        },
        function(callback) {
          gameCreate("Halo", "Halo: Combat Evolved is a first-person shooter video game developed by Bungie and published by Microsoft Game Studios. It was released as a launch title for Microsoft's Xbox video game console on November 15, 2001.", developers[0], [genres[0],], callback);
        },
        function(callback) {
          gameCreate("Command and Conquer", "Command & Conquer (C&C) is a real-time strategy (RTS) video game franchise, first developed by Westwood Studios. The first game was one of the earliest of the RTS genre, itself based on Westwood Studios' influential strategy game Dune II and introducing trademarks followed in the rest of the series.", developers[0], [genres[0],], callback);
        },
        function(callback) {
          gameCreate("League of Legends", "League of Legends (abbreviated LoL or League) is a 2009 multiplayer online battle arena video game developed and published by Riot Games for Microsoft Windows and macOS.", developers[1], [genres[1],], callback);
        },
        function(callback) {
          gameCreate("Call of Duty","Call of Duty is a first-person shooter video game franchise published by Activision. Starting out in 2003, it first focused on games set in World War II.", developers[1], [genres[1],], callback);
        },
        function(callback) {
          gameCreate('Test Game 1', 'Summary of test game 1', developers[4], [genres[0],genres[1]], callback);
        },
        function(callback) {
          gameCreate('Test Game 2', 'Summary of test game 2', developers[4], false, callback)
        }
        ],
        // optional callback
        cb);
}


function createGameInstances(cb) {
    async.parallel([
        function(callback) {
          gameInstanceCreate(games[0], false, 'Available', callback)
        },
        function(callback) {
          gameInstanceCreate(games[1], false, 'Loaned', callback)
        },
        function(callback) {
          gameInstanceCreate(games[2], false, false, callback)
        },
        function(callback) {
          gameInstanceCreate(games[3], false, 'Available', callback)
        },
        function(callback) {
          gameInstanceCreate(games[3], false, 'Available', callback)
        },
        function(callback) {
          gameInstanceCreate(games[3], false, 'Available', callback)
        },
        function(callback) {
          gameInstanceCreate(games[4], false, 'Available', callback)
        },
        function(callback) {
          gameInstanceCreate(games[4], false, 'Maintenance', callback)
        },
        function(callback) {
          gameInstanceCreate(games[4], false, 'Loaned', callback)
        },
        function(callback) {
          gameInstanceCreate(games[0], false, false, callback)
        },
        function(callback) {
          gameInstanceCreate(games[1], false, false, callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createGenreAuthors,
    createGames,
    createGameInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('GAMEInstances: '+gameinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



