var express = require('express');
var router = express.Router();
/* login route */
router.post('api/login', function(req, res) {
  // TODO: Check if it's a valid login
  if(err) {
    res.send(err);
  } else {
    res.json(userinfo);
  }
});
module.exports = router;