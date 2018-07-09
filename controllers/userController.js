var passport = require('passport');
var User = require('../models/user');
var Order = require('../models/order');
var Cart = require('../models/cart');
var formatCurrency = require('format-currency');

/// request that can oly be granted with isLoggedIn = true
exports.user_profile_get = function (req, res, next) {
	res.render('user/profile', { csrfToken: req.csrfToken() });
};

exports.user_profile_post = function (req, res, next) {
	res.send('NOT IMPLEMENTED. profile POST');
};

exports.user_history_get = function (req, res, next) {
	Order.find({ user: req.user }, function (err, orders) {
		if (err) {
			return next(err);
		}
		var cart;
		orders.forEach(function (order) {
			cart  = new Cart(order.cart);
			order.items = cart.generateArray();
		});
		res.render('user/history', { orders: orders, helpers: {
        foo: function (num) { return formatCurrency(num) }} });
	});
};

exports.user_complaint_get = function (req, res, next) {
	res.render('user/complaint', { title: 'Untuk Pengaduan, silahkan masukan keluhan Anda.', headContent: '<script>/*put your customize head script here*/</script>', csrfToken: req.csrfToken()});
};

exports.user_complaint_post = function (req, res, next) {
	res.send('NOT IMPLEMENTED, user/complaint POST!');
};

exports.user_logout_get = function (req, res, next) {
	req.logout(); // passport function
	res.redirect('/');
};

/// request that can be accessed without logged in
exports.user_signup_get = function (req, res, next) {
	var messages = req.flash('error');
	res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
};

exports.user_signup_post = function (req, res, next) {
	if (req.session.oldUrl) {
		var oldUrl = req.session.oldUrl; // retrieve
		req.session.oldUrl = null;	// clear it
		res.redirect(oldUrl); // redirect
	}
	else {
		res.redirect('/user/profile');
	}
};

exports.user_signin_get = function(req, res, next) {
	var messages = req.flash('error');
  	res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
};

exports.user_signin_post = function (req, res, next) {
	if (req.session.oldUrl) {
		var oldUrl = req.session.oldUrl; // retrieve
		req.session.oldUrl = null;	// clear it
		res.redirect(oldUrl); // redirect
	}
	else {
		res.redirect('/user/profile');
	}
};