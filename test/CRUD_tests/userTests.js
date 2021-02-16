const assert = require('assert');
const User = require(`${__basedir}/api/user/model/user.js`);

describe('Testing CRUD operations for user model', () => {
	let user;
	beforeEach((done) => {
		// noinspection JSAnnotator
        user = new User({
			name: {
				firstName: 'Joe',
				lastName: 'Kunz'
			},
			username: 'joe',
			password: 'test123',
			age: '27',
			address: {
				zip: '12053',
				city: 'Berlin',
				street: 'Herrmannstrasse',
				streetNumber: 222,
				country: 'Deutschland'
			},
			contact: {
				email: 'test123@gmx.de',
				phone: 11234567
			}
		});
		user.save()
		.then(() => {	
			done();
		});	
	});

	it('saves a user', () => {	
		assert(!user.isNew);
	});

	it('reads a user from DB and tests passwordHashing', (done) => {	
		User.findById(user._id)
			.select('+password')
			.then((data) => {	
				assert(data.name.firstName === 'Joe');
				assert(data.password === data.generateHash('test123'));
				done();
			})
			.catch((error) => {	
				console.log(error);
			});
	});

	it('updates a user', (done) => {	
		user.name.firstName = 'Alex';
		user.save()
		.then(() => {	
			User.findById(user._id)
			.then((data) => {	
				assert(data.name.firstName === 'Alex');
				done();
			});
		})
		.catch((error) => {	
				console.log(error);
			});
	});

	it('removes a user from DB', (done) => {	
		user.deleteOne()
			.then(() => {	
				return User.findById(user._id);
			})
			.then((data) => {	
				assert(data === null);
				done();
			})
			.catch((err) => {	
				console.log(err);
			});
	});

});
