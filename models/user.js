var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    state: String,
    county: String,
    driverLicense: String,
    emailAuthorized: Boolean,
    userRole: String
});

User.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', User);
