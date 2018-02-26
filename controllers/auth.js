var passport = require('passport');
var User = require('../models/user');
var AuthKey = require('../models/authKey');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'voteziservices@gmail.com',
    pass: 'votezinow'
  }
});

function checkEmail(emailAddress) {
  var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
  var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
  var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
  var sQuotedPair = '\\x5c[\\x00-\\x7f]';
  var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
  var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
  var sDomain_ref = sAtom;
  var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
  var sWord = '(' + sAtom + '|' + sQuotedString + ')';
  var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
  var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
  var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
  var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

  var reValidEmail = new RegExp(sValidEmail);

  return reValidEmail.test(emailAddress);
}

function checkLicense(license)
{
  var alphanumericLength = new RegExp('@"^[A-Za-z0-9]{4,9}$"');
  var thirdFourthNumeric = new RegExp("^..[0-9]{2}");
  var atLeastFourNumeric = new RegExp("(.*[0-9]){4}");
  var moreThanTwoAlpha = new RegExp("(.*[A-Za-z]){3}");

  return alphanumericLength.test(license) && thirdFourthNumeric.test(license)
          && atLeastFourNumeric.test(license) && !moreThanTwoAlpha.test(license);
}

function generateAuthToken() {
        var lowChars = "abcdefghijklmnopqrstuvwxyz".split("");
        var capChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        var numChars = "0123456789".split("");
        var allChars = lowChars.concat(capChars).concat(numChars);
        var result = "";

        // The format is XXXXXXXX-XXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXX
        for(var i=0; i<8; i++) {
            result += allChars[Math.floor(Math.random() * allChars.length)];
        }
        result += "-";
        for(i=0; i<16; i++) {
            result += allChars[Math.floor(Math.random() * allChars.length)];
        }
        result += "-";
        for(i=0; i<16; i++) {
            result += allChars[Math.floor(Math.random() * allChars.length)];
        }
        return result;
};

module.exports.loginShow = function(req, res) {
    res.render('login');
}

module.exports.login = function(req, res) {
    passport.authenticate('local')(req, res, function() {
        res.redirect('/');
    });
}

module.exports.registerShow = function(req, res) {
    res.render('register');
}

module.exports.register = function(req, res) {
    if (!checkEmail(req.body.email)){
      return res.render('register', {error: "You must provide a valid email."})
    }
    if (req.body.firstName.length === 0 || !req.body.firstName.trim()){ // Makes sure there's an actual value
      return res.render('register', {error: "You must provide a first name."})
    }
    if (req.body.lastName.length === 0 || !req.body.lastName.trim()){
      return res.render('register', {error: "You must provide a last name."})
    }
    if (req.body.state.length === 0 || !req.body.state.trim()){
      return res.render('register', {error: "You must provide a valid state."})
    }
    if (req.body.county.length === 0 || !req.body.county.trim()){
      return res.render('register', {error: "You must provide a valid county."})
    }
    if (checkLicense(req.body.driverLicense)){
      return res.render('register', {error: "You must provide a valid driver's license ID"})
    }
    if (req.body.password.length === 0 || !req.body.password.trim()){
      return res.render('register', {error: "You cannot use just spaces as a password."})
    }
    User.register(new User({ email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, state: req.body.state, county: req.body.county, driverLicense: req.body.driverLicense, emailAuthorized: false, userRole: "" }), req.body.password, function(err, account) {
        if(err) return res.render('register', { error: err }); // want to pass back error, or err object itself

        var newAuthKey = new AuthKey({ user: account, authKey: generateAuthToken() });
        newAuthKey.save(function (err, authKey) {
          if (err) return res.render('register', {error: "There was an error processing your request. Please try again later."})
        });

        var mailOptions = {
          from: "voteziservices@gmail.com",
          to: req.body.email,
          subject: 'Authenticate Your Votezi Account',
          html: 'We recently recieved a registration for Votezi Services associated with this email account.\n\nIf this is you, please either click the link or paste it into your browser: <a href="http://localhost:3000/signup/' + newAuthKey.authKey + '">http://localhost:3000/signup/' + newAuthKey.authKey + '</a>'
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            return res.render('register', {error: "There was an error processing your request. Please try again later."})
          }
        });

        passport.authenticate('local')(req, res, function() {
            res.redirect('/');
        });
    });
}

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}

module.exports.authorize = function(req, res) {
    var auth = req.params.auth;

    AuthKey.findOne({ 'authKey' : auth }, function(err, authKeySet) {
      if (err) {return res.render('auth', {error: err});} //"We couldn't find that authorization key. Please verify you entered the right one."

      console.log(authKeySet.user);
      User.findById( authKeySet.user, function(err, authUser){
        if (err) {return res.render('auth', {error: err});} //"We couldn't find that authorization key. Please verify you entered the right one."

        authUser.emailAuthorized = true;

        authUser.save(function (err, newAuthUser) {
          if (err) return res.render('auth', {error: err});

          authKeySet.remove(function(err) {
            if (err) {return res.render('auth', {error: err});}
            return res.render('auth', {error: ""});
          });
        });

      });
    });
}
