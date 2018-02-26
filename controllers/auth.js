var passport = require('passport');
var User = require('../models/user');

module.exports.loginShow = function(req, res) {
    res.render('login');
}

module.exports.login = function(req, res) {
    passport.authenticate('local')(req, res, function() {
        res.redirect('/mainpage');
    });
}

module.exports.registerShow = function(req, res) {
    res.render('register');
}

module.exports.register = function(req, res) {
    res.redirect('/login') //I should let redirect within authenticate? I am not sure.
}

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}
