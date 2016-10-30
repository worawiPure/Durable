var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session =require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var prints = require('./routes/prints');
var general_add_asset = require('./routes/general_add_asset');
var medical_add_asset = require('./routes/medical_add_asset');
var durable_general = require('./routes/durable_general');
var durable_medical = require('./routes/durable_medical');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('imgaes', path.join(__dirname, 'imgaes'));
app.set('imgae engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'sdfjlkjlksdlkfjsjdl',
  resave:false,
  saveUninitialized:true,
  cookie:{secure:false}
}));

var db = require('knex')({
  client:'mysql',
  connection: {
    host:'127.0.0.1',
    port:3306,
    database:'stock',
    user:'root',
    password:''
  }
});

app.use(function (req,res,next) {
  req.db= db;
  next();
});

var auth = function(req,res,next){
  var logged = req.session.logged;
  if(logged){
    next();
  }
  else{
    res.redirect('/users/login')
  }
}
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});
app.use('/users', users);
app.use('/prints',auth,prints);
app.use('/general_add_asset',auth,general_add_asset);
app.use('/medical_add_asset',auth,medical_add_asset);
app.use('/durable_general',auth,durable_general);
app.use('/durable_medical',auth,durable_medical);
app.use('/',auth,routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
//// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    //res.status(err.status || 500);
    console.log(err)
  });
}
//
//// production error handler
//// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err)
});


module.exports = app;
