const mongoose = require('mongoose');
const url  = 'mongodb+srv://admin:admin123@cluster0.jvpze.mongodb.net/Assignment2?retryWrites=true&w=majority';

mongoose.connect(url, { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('Connection created.')
    }
    else {
        console.log('Connection failed: : ' + err)
    }
});

// get user model model
require('./user.model');
