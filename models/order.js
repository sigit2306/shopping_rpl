var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	cart: {type: Object, required: true},
	address: {type: String, required: true},
	name: {type: String, required: true},
	paymentId: {type: String, required: true}
	//, createdDate: { type: Date, default: Date.now }
	//, statusOrder: { type: String, required: true, enum: ['Process', 'Delivery', 'Delivered', 'Received'],  default: 'Process'}
	//, statusDate: { type: Object, required: true, default: { Process: Date.now }}
	//, complaintConversation: { type: Arrays }
});

module.exports = mongoose.model('Order', schema);