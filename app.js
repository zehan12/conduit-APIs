require("dotenv").config();
console.log(process.env.SECRET)
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const connectionParams={
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true 
}

mongoose.connect("mongodb+srv://zehan:zehan@cluster0.1rlox.mongodb.net/?retryWrites=true&w=majority",  { useNewUrlParser: true, useUnifiedTopology: true },
(err) => { console.log('Connected to database: ', err ? err : true); } );


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const userRouter = require('./routes/user');
const articlesRouter = require('./routes/articles');
const commentsRouter = require('./routes/comments');
const profilesRouter = require('./routes/profiles');

const app = express();

const interceptor = require("express-interceptor");

const mainIntercept = interceptor(function (req, res) {
  return {
    isInterceptable: function () {
      return true
    },

    intercept: function (body, send) {
      // console.log(body)
      if ( !body.image ) body.image = null;
      if ( !body.bio ) body.bio = null;
      send(body)
    },

    afterSend: (oldBody, newBody) => {
      // console.log(newBody,"new")
      return newBody
    }
  }
});

app.use(mainIntercept);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/user', userRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/articles/:slug/comments', commentsRouter);
app.use('/api/profiles', profilesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
