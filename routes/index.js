var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
var formatCurrency = require('format-currency');

var sendMailPurchase = require('../public/javascripts/sendMailPurchase');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessage: !successMsg, helpers: {
        foo: function (num) { return formatCurrency(num) }} });
  });
});

router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/');
  });
});

router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart :{});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
})

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: formatCurrency(cart.totalPrice), helpers: {
    foo: function (num) { return formatCurrency(num) }} });
})

router.get('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', { total: formatCurrency(cart.totalPrice), errMsg: errMsg, noError: !errMsg });
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  // stripe section
  var keys = require('./config/keys');
  var stripe = require("stripe")(keys.stripeSecretKey);
  /* 
    or exposed:
    var stripe = require("stripe")("sk_test_x0tJzpxmIT9wMYYU04IG6srG");
  */

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "idr",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Tagihan untuk Anda"
  }, function(err, charge) {
    // asynchronously called
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }

    // mongodb section
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });

    order.save(function (err, result) {
      if (err) {
        req.flash('error', err.message);
        return redirect('/checkout');
      }
      req.flash('success', 'Produk berhasil dibeli');
      // sending purchase email to client, using the data from req.session.cart before emtying it
      //sendMailPurchase();
      //
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) { // passport function
    return next();
  }
  res.redirect('/user/signin');
};

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) { // passport function
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
};