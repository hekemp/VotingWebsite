var express = require('express');
var router = express.Router();

// Route is when to do
// Controller is how to do (database, calculations, what to display [data]) and try to render it out (backend)
// EJS is how to handle that content like the front end/backend

var indexController = require('../controllers/index');
var authController = require('../controllers/auth');
// Default route, our index page, essentially.
// This renders out 'index' which is index.ejs, and passes in the title, Express.
/* GET home page. */


router.get('/', indexController.homepage); // When we get a request for a /, so whatever indexController says to do for it
router.get('/login', authController.loginShow);
router.get('/register', authController.registerShow);





router.post('/', indexController.registerRedirect());

router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/logout', authController.logout);

module.exports = router;
