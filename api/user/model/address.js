const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
	zip: {
		type: String
		// required: [true, 'Zipcode is required.'],
	},
	street: {
		type: String
		// required: [true, 'Street is required.'],
	},
	streetNumber: {
		type: String
	},
	country: {
		type: String
	},
	city: {
		type: String
		// required: [true, 'City is required.'],
	}
});
module.exports = AddressSchema;
