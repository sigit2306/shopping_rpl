var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// product schema
var productSchema = new Schema({
	imagePath: { type: String, required: true},
	title: { type: String, required: true },
	description: { type: String, required: true	},
	price: { type: Number, required: true },
	discount: { type: Number }
	//,	priceAfterDiscount: { type: Number }
	//, createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);