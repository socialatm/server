const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NameSchema = new Schema({
	firstName: {
		type: String,
		required: [true, 'Firstname is required.']
	},
	middleNames: [{
		type: String
	}],
	lastName: {
		type: String,
		required: [true, 'Lastname is required.']
	}
});
module.exports = NameSchema;
