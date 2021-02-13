require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./Server/routes/router');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();

const port = process.env.PORT;
app.listen(port);
console.log("App listening on port " + port + " ----> Press cmd-C to terminate");

app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());

if(process.env.NODE_ENV !== 'test'){
    app.use(express.static(__dirname + '/Public'));
    app.use(morgan('dev')); // log every request to the console
    mongoose.Promise = require('bluebird');
    mongoose.connect('mongodb://localhost:27017/clonebookdb', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});
    mongoose.connection
        .once('open', () => {
            console.log('Connection to DB established');
        })
        .on('error', (error) => {
            console.warn('Warning', error);
        });
}

require('./Server/config/passport');
app.use(passport.initialize());

router(app);

app.get('/', function (req,res) {
    //noinspection JSUnresolvedFunction
    res.sendFile(__dirname + "/Public/index.html");
});
// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    }
});

module.exports = app;