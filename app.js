var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var multer = require('multer')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var teacherRouter = require('./routes/teacher');
var adminRouter = require('./routes/admin');
var studentRouter = require('./routes/student');
var headRouter = require('./routes/head');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads')
  },
  filename: function(req, file, cb) {
      cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

const connection = mongoose.connect('mongodb://localhost:27017/lms', { useNewUrlParser: true, useUnifiedTopology: true });
var app = express();

connection.then((db) => {
  console.log("[+] Database Connected");
}, (err) => { console.log(err); });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);
app.use('/head', headRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
