require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const githubStrategy = require('passport-github').Strategy;
const userController = require('./controllers/user');
const bodyParser = require("body-parser");
//For authentication
const session = require('express-session')
const passport = require('passport');
const flash=require("connect-flash");
const LocalStrategy = require('passport-local').Strategy;

const app = express();




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// file static path
app.use('/static', express.static(path.join(__dirname, 'assets/')));

app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs(
    { extname: 'hbs', defaultLayout: 'main',
        layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');



app.use(session({
    secret: '!2@@@115',
    resave: true,
    saveUninitialized: true
}))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//
const User = require('./models/user.model');
passport.use(User.createStrategy());



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', userController);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`SERVER is listening on PORT ${port}`);
});


