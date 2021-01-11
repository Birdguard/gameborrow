if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');


const passport = require('passport');

const flash = require('express-flash');
const session = require('express-session');

var app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(upload.array());
app.use(cookieParser());
app.use(session({ secret: 'your secret key' }));

var Users = [];

// app.get('/signup', function(req, res){
//   res.render('signup');
// });

// app.post('/signup', function(req, res){
//   if(!req.body.id || !req.body.password){
//      res.status("400");
//      res.send("Invalid details!");
//   } else {
//      Users.filter(function(user){
//         if(user.id === req.body.id){
//            res.render('signup', {
//               message: "User Already Exists! Login or choose another user id"});
//         }
//      });
//      var newUser = {id: req.body.id, password: req.body.password};
//      Users.push(newUser);
//      req.session.user = newUser;
//      res.redirect('/protected_page');
//   }
// });
// function checkSignIn(req, res){
//   if(req.session.user){
//      next();     //If session exists, proceed to page
//   } else {
//      var err = new Error("Not logged in!");
//      console.log(req.session.user);
//      next(err);  //Error, trying to access unauthorized page!
//   }
// }
// app.get('/protected_page', checkSignIn, function(req, res){
//   res.render('protected_page', {id: req.session.user.id})
// });

// app.get('/login', function(req, res){
//   res.render('login');
// });

// app.post('/login', function(req, res){
//   console.log(Users);
//   if(!req.body.id || !req.body.password){
//      res.render('login', {message: "Please enter both id and password"});
//   } else {
//      Users.filter(function(user){
//         if(user.id === req.body.id && user.password === req.body.password){
//            req.session.user = user;
//            res.redirect('/protected_page');
//         }
//      });
//      res.render('login', {message: "Invalid credentials!"});
//   }
// });

// app.get('/logout', function(req, res){
//   req.session.destroy(function(){
//      console.log("user logged out.")
//   });
//   res.redirect('/login');
// });

// app.use('/protected_page', function(err, req, res, next){
// console.log(err);
//   //User should be authenticated! Redirect him to log in.
//   res.redirect('/login');
// });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');

var mongoose = require('mongoose');

// const passportLocalMongoose = require('passport-local-mongoose');

var dev_db_url = "mongodb+srv://birdguard:Karan123@cluster0.ckgdu.mongodb.net/local_library?retryWrites=true&w=majority"
var mongoDB = process.env.MONGODB_URI || dev_db_url;

// var mongoDB = 'mongodb+srv://birdguard:Karan123@cluster0.ckgdu.mongodb.net/local_library?retryWrites=true&w=majority'

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;