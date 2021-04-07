const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const passport = require('passport')

const authorize = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/register', (req, res) => {
    res.render("registration", {
        viewTitle: "Register to competition"
    });
});


router.get('/login', (req, res) => {
    res.render("login", {
        viewTitle: "Account Login"
    });
});


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

//Allow users to delete their account
router.get('/delete', authorize, (req, res, next) => {
    User.findByIdAndRemove(req.user._id, (err, doc) => {
        if (!err) {
            req.logout();
            res.redirect('/');
        }
        else {
            console.log(err);
        }
    });
});

router.post('/login',
    passport.authenticate('local',
        { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
}));

router.get('/test', authorize, (req, res, next) => {
    res.render("test", {
        viewTitle: "Attempt Typing Test",
        user: req.user
    });
});

router.post('/save-test', authorize, (req, res, next) => {
    // res.render("profile", {
    //     viewTitle: "Profile",
    //     user: req.user
    // });

    let user  = req.user;
    console.log(user);
    let conditions = {
        _id: user._id
    }
    let  update = {
        wordsPerMinute: req.body.wpm,
        accuracy: req.body.accuracy
    }
    User.findOneAndUpdate(conditions, update, function (error, result){
        res.redirect('/');
    })
});

router.post('/register', (req, res) => {
    insertRecord(req, res);
});

function insertRecord(req, res) {
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.country = req.body.country;
    user.gender = req.body.gender;
    user.age = req.body.age;
    User.register(user, req.body.password, (err, doc) => {
        if (!err){
            req.login(doc, (err) => {
                res.redirect('/');
            });
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('registration', {
                    viewTitle: 'Enroll for competition',
                    user: req.body
                });
            }else if (err.name == 'UserExistsError'){
                res.render('registration', {
                    error: 'User with the same email already registered!'
                })
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

router.get('/', (req, res) => {
    User.find().sort([['wordsPerMinute', -1]]).lean().exec( function (err, docs)  {
        if (!err) {
            // console.log(docs)
            res.render('home', {
                userList: docs,
                user: req.user
            });
        }
        else {
            console.log('Error in retrieving users list :' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (let field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'country':
                body['countryError'] = err.errors[field].message;
                break;
            case 'gender':
                body['genderError'] = err.errors[field].message;
                break;
            case 'age':
                body['ageError'] = err.errors[field].message;
                break;
            case 'password':
                body['passwordError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

module.exports = router;
