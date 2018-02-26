
var User = require('../models/user');

module.exports.requestAccess = function(req, res) {

    User.findOne({ 'email' : req.user.email }, function(err, initialUser) {
      if (err) { console.log(err); }

      initialUser.userRole = "Pending";

      initialUser.save(function (err, newUser) {
        if (err) {console.log(err);}

        res.redirect('/');

      });
    });
};
