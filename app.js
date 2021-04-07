var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cookieSession = require('cookie-session');

//===============define====view==========================//
//ส่งออกจากเราเตอร์มาไว้ตรงนี้
var homeRouter = require('./routes/home');
var accountRouter = require('./routes/account');
var postRouter = require('./routes/post');
var registerRouter = require('./routes/register');
var signupRouter = require('./routes/login');
var testRouter = require('./routes/register01');
var logoutRouter = require('./routes/logout');
var tagRouter = require('./routes/tag');
var likesRouter = require('./routes/likes');
var commentRouter = require('./routes/comment');


var app = express();
//
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge:  3600 * 1000 // 1hr
}));
console.log('cookie');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);//อันนี้ช่วยได้เยอะ

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//--------------------มาตั้งเราเตอร์ตรงนี้-------------------------//
app.use('/', homeRouter);
app.use('/account', accountRouter);
app.use('/post', postRouter);
app.use('/register', registerRouter);
app.use('/login', signupRouter);
app.use('/register01', testRouter);
app.use('/logout', logoutRouter);
app.use('/tag', tagRouter);
app.use('/likes', likesRouter);
app.use('/comment', commentRouter);

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



// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1', 'key2'],
//   maxAge:  3600 * 1000 // 1hr
// }));
// console.log('cookie');


module.exports = app;
