var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var expressHandlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var items = require('./data/items.json');
var index = require('./routes/index');

var app = express();



// MongoDB Credentials
var username = "admin";
var password = "password";
var databaseName = "smart-cart";
var databaseURI = "mongodb://" + username + ":" + password + "@ds119081.mlab.com:19081/" + databaseName;
mongoose.Promise = global.Promise;

// The url specified below is of the format 'server/database-name'.
var connection = mongoose.createConnection(databaseURI);

connection.on('error', console.error.bind(console, 'connection error:'));
connection.on('open', function() {

  console.log("connection established");

  // view engine setup.
  // .hbs is used in the second Statement to reference the exgine created in the first Statement.
  app.engine('.hbs', expressHandlebars({ 
                      defaultLayout: 'layout', 
                      extname: '.hbs'
                    }));
  app.set('view engine', '.hbs');

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', index);

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

});

module.exports = app;
