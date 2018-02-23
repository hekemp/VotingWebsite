// This is going to describe to the application, what it should do when it tries to render out the homepage

var passport = require('passport');



module.exports.homepage = function(req, res) {
    res.render('homepage', { title: "VotingWebsite", user: req.user }); // this is the same as it used to be from the route's index.js
}

module.exports.registerRedirect = function(req, res) {
  console.log('lol');
  res.redirect('/register');
}


module.exports.login = function(req, res) {
  passport.authenticate('local')(req, res, function() {
    res.redirect('/mainpage');
  });
}

module.exports.requestShow = function(req,res)
{
  res.render('request');
}

module.exports.mainShow = function(req,res)
{
  res.render('mainpage');
}
