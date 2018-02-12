var express = require('express');
var router = express.Router();
var mongojs = require("mongojs");
var db = mongojs('mongodb://<stevenru>:<Rzy123456789>@ds233208.mlab.com:33208/votingsystem5800',['voting'] )
/* route to handle all angular requests. */
router.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

module.exports = router;