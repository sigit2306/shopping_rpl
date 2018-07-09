var user_controller = require('../controllers/userController');
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

// set the protection
var csrfProtection = csrf();
router.use(csrfProtection);

/// USER ROUTES ///

/// request that can oly be granted with isLoggedIn = true
// GET request for user profile.
router.get('/profile', isLoggedIn, user_controller.user_profile_get);

// POST request to update user profile
router.post('/profile', isLoggedIn, user_controller.user_profile_post);

// GET request for history of purchase
router.get('/history', isLoggedIn, user_controller.user_history_get);

// GET request for complaint
router.get('/complaint', isLoggedIn, user_controller.user_complaint_get);

// POST request to complaint
router.post('/complaint', isLoggedIn, user_controller.user_complaint_post);

// GET request for logout
router.get('/logout', isLoggedIn, user_controller.user_logout_get);


/// request that can be accessed without isLoggedIn = true
// this will set all below middleware can access without logged in
router.use('/', notLoggedIn, function (req, res, next) {
	next();
}); 

// GET request for signup
router.get('/signup', user_controller.user_signup_get);

// POST request to signup, using passport.authenticate 
router.post('/signup', passport.authenticate('local.signup', {
  //successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}), user_controller.user_signup_post);

// GET request for signin 
router.get('/signin', user_controller.user_signin_get);

// POST request to signin
router.post('/signin', passport.authenticate('local.signin', {
  //successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}), user_controller.user_signin_post);

// default module export
module.exports = router;

// hoisted methods (functions)
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) { // passport function
		return next();
	}
	res.redirect('/');
};

function notLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) { // passport function
		return next();
	}
	res.redirect('/');
};