const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
	zip: {
		type: String
	},
	street: {
		type: String
	},
	streetNumber: {
		type: String
	},
	country: {
		type: String
	},
	city: {
		type: String
	}
});
module.exports = AddressSchema;
