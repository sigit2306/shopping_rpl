var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require("moment");
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true }
	//, firstName: {type: String, required: true, max: 100 }
	//, familyName: {type: String, required: true, max: 100 }
	//, dateOfBirth: { type: Date }
	//, address: {type: String, required: true }
	//, postalCode: { type: String, max: 10 }
	//, mobileNumber: { type: String }
	//, otherNumber: {type: String }
	//, createdDate: { type: Date, default: Date.now }
});

// virtual (property) for user's full name in Indonesia format
userSchema
	.virtual('fullNameInId')
	.get(function () {
		return this.firstName + " " + this.familyName;
	});

// virtual (property) for user's full name in English format
userSchema
	.virtual('fullNameInEn')
	.get(function () {
		return this.familyName + ", " + this.firstName;
	});

// virtual (property) for dateOfBirth
userSchema
	.virtual('dateOfBirth_formatted')
	.get(function () {
		return this.dateOfBirth ? moment(this.dateOfBirth).format("YYYY-MM-DD") : '';
	});


// methods for userSchema
userSchema.methods.encryptPassword = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);