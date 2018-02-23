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
    User.register(new User({ email: req.body.email }), req.body.password, function(err, account) {
        if(err) return res.render('register', { account: account }); // want to pass back error, or err object itself

        passport.authenticate('local')(req, res, function() {
          console.log('1111')
          res.redirect('/login');
        });
    });
    res.redirect('/login') //I should let redirect within authenticate? I am not sure.
}

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}
