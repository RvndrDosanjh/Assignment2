const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/typists', { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('Connection created.')
    }
    else {
        console.log('Connection failed: : ' + err)
    }
});

// get user model model
require('./user.model');
