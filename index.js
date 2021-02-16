global.__basedir = __dirname;
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();

const port = process.env.PORT;
app.listen(port);
console.log(`Server listening on port ${port} ----> Press cmd-C to terminate`);

app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(express.json()); //Used to parse JSON bodies

if (process.env.NODE_ENV !== 'test'){
  app.use(express.static(__dirname + '/Public'));
  app.use(morgan('dev')); // log every request to the console
  mongoose.connect('mongodb://localhost:27017/clonebookdb', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});
  mongoose.connection
    .once('open', () => {
      console.log('Connection to DB established');
    })
    .on('error', (error) => {
      console.warn('Warning', error);
    });
}

require('./config/passport');
app.use(passport.initialize());

router(app);

app.get('/', function (req,res) {
  // noinspection JSUnresolvedFunction
  res.sendFile(__dirname + "/Public/index.html");
});

// error handlers - Catch unauthorized errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({message: err.name + ": " + err.message});
  }
});

module.exports = app;
