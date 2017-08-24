var express = require('express');
var path = require('path');
var debug = require('debug')('myapp-app'); // debug模块 

var app = express();
app.set('port', process.env.PORT || 3000); // 设定监听端口  

var favicon = require('serve-favicon');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var logger = require('morgan');
app.use(logger('dev'));
var bodyParser = require('body-parser'); //JSON parser to process req data from client
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
var hbs = require('hbs');
app.set('view engine', 'hbs');
hbs.registerPartials( path.join(__dirname, '/views/partials') );

//passport control
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session());
// {
//   secret: 'hello! TMY', 
//   resave: true, 
//   saveUninitialized: true
// }));

var User = require('./models/user');
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', function(err){
    if(err){
        console.log('Could not connect to mongodb on localhost. ');
    }
    debug('connect to mongodb://localhost/test');
});

//setup routers
var index = require('./routes/index');
var users = require('./routes/users');
var account = require('./routes/account');
app.use('/', index);
app.use('/users', users);
app.use('/account', account);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//module.exports = app;
//启动监听  
var server = app.listen(app.get('port'), function() {  
  debug('Express server listening on port ' + server.address().port);  
}); 
