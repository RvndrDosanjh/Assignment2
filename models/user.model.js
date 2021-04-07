const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please enter full name.'
    },
    email: {
        type: String
    },
    age: {
        type: "number",
        required: 'Please enter the age'
    },
    country: {
        type: String,
        required: 'Please enter country'
    },
    gender: {
        type: String,
        required: 'Please select gender'
    },
    password: {
        type: String,
    },

    wordsPerMinute:{
        type: "number",
        default: 0
    },

    accuracy: {
        type: "number",
        default: 0
    },
    attempts: {
        type: "number",
        default: 0
    }
});

// email validation
userSchema.path('email').validate((val) => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Please enter valid e-mail address.');

// Validate password

userSchema.path('password').validate((val) => {
    return val.length >= 6;
},  'Password must be must  6 characters minimum');


userSchema.path('age').validate((val) => {
    return val >= 10;
},  'Age must be 10 or above');
userSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

module.exports = mongoose.model('userModel', userSchema);
