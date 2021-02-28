const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
	email: {
		type: String,
		required: [true, 'Email is required.'],
		index: { unique: true }
	},
	phone: {
		type: String
	}
});
module.exports = ContactSchema;
