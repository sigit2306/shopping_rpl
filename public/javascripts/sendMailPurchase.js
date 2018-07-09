// this module will be part of /checkout router POST.
var nodemailer = require('nodemailer');

function sendMailPurchase() {
	//var nodemailer = require('nodemailer'); // closure
	var transporter = nodemailer.createTransport({
	 service: 'gmail',
	 auth: {
	        user: 'tgs.rpl.urt@gmail.com',
	        pass: 'testing!12345'
	    }
	});
	const mailOptions = {
	  from: 'tgs.rpl.urt@gmail.com', // sender address
	  to: 'sgtwijanarko23@gmail.com', // list of receivers
	  subject: 'Ringkasan Pesanan Anda di URT', // Subject line
	  html: '<p>Terima kasih atas pembelian Anda.</p> <br> <p>Pesanan akan Anda segera kami antar.</p>'// plain text body
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	    next(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
};

module.exports = sendMailPurchase;