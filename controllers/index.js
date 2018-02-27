// This is going to describe to the application, what it should do when it tries to render out the homepage

module.exports.homepage = function(req, res) {
    res.render('homepage', { title: "request", user: req.user }); // this is the same as it used to be from the route's index.js
}
