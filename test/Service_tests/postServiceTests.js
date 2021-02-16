const assert = require('assert');
const User = require(`${__basedir}/api/user/model/user.js`);
const Post = require(`${__basedir}/api/post/model/post.js`);
const request = require('supertest');
const app = require(`${__basedir}/index.js`);
const Friendship = require(`${__basedir}/api/friendship/model/friendship.js`);

describe('Testing Service methods for post', () => {
	let user, user2, post1, post2, post3, friendship;
	beforeEach((done) => {
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
		user2 = new User({
			name: {
				firstName: 'Konstantin',
				lastName: 'Schall'
			},
			username: 'konsi',
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
				email: 'test@gmx.de',
				phone: 112345
			}
		});

		friendship = new Friendship({
			userOne: user,
			userTwo: user2
		});

		post1 = new Post({
			title: 'test title',
			content: 'test content 123',
			mediaType: 'IMG',
			media: 'http://placekitten.com/200/300'
		});
		post2 = new Post({
			title: 'test title2',
			content: 'test content 2',
			mediaType: 'IMG',
			media: 'http://placekitten.com/200/300'
		});
		post3 = new Post({
			title: 'test title3',
			content: 'test content 3',
			mediaType: 'IMG',
			media: 'http://placekitten.com/200/300'
		});
		user.posts.push(post1, post2, post3);

		Promise.all([user.save(), user2.save(), friendship.save(), post1.save(), post2.save(), post3.save()])
			.then(() => {

				request(app)
					.post('/data/login')
					.send({
						username: 'joe',
						password: 'test123'
					})
					.end((err, res) => {
						token = JSON.parse(res.text).token;
						done();
					})
			});
	});

	it('POST /data/post creates a new post', (done) => {
		request(app)
			.post(`/data/post`)
			.set('Authorization', 'Bearer ' + token)
			.send({
				title: 'posttest',
				content: 'test content 2',
				mediaType: 'IMG',
				media: 'http://placekitten.com/200/300'
			})
			.end((err, response) => {
				assert(response.body.title === 'posttest');
				done();
			});
	});

	it('POST /data/post with an attached image and DELETEs it in the end', (done) => {
		let idPost;
		request(app)
			.post(`/data/post`)
			.set('Authorization', 'Bearer ' + token)
			.field({
				title: 'posttest',
				content: 'test content 2'
			})
			.attach('media', 'test/Service_tests/klein.png')
			.end((err, response) => {
				idPost = response.body._id;
				assert(response.body.media.includes("https://socialatm.s3.us-east-2.amazonaws.com/"));

				request(app)
					.delete(`/data/post/${idPost}`)
					.set('Authorization', 'Bearer ' + token)
					.end((err, response) => {
						Post.findById(idPost)
							.then((post) => {
								assert(post === null);
								done();
							});
					});
			});
	});

	it('PUT /data/post/:id a new title to an existing post', (done) => {
		const updatedPost = post1;
		updatedPost.title = 'updated title';
		request(app)
			.put(`/data/post/${post1._id}`)
			.set('Authorization', 'Bearer ' + token)
			.send(updatedPost)
			.expect(200)
			.end((err, response) => {
				assert(response.status === 200);
				Post.findById(post1._id)
					.then((post) => {
						assert(post.title = 'updated title');
						done();
					});
			});
	});

	it('DELETE /data/post:id a existing post from DB', (done) => {
		request(app)
			.delete(`/data/post/${post1._id}`)
			.set('Authorization', 'Bearer ' + token)
			.end((err, response) => {
				Post.findById(post1._id)
					.then((post) => {
						assert(post === null);
						done();
					});
			});
	});

	it('PUT /data/post/:id/like puts a like to an existing post and checks if this post is now followed b the requester', (done) => {
		request(app)
			.put(`/data/post/${post1._id}/like`)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.end((err, res) => {
				Post.findById(post1._id)
					.then((post) => {
						assert(post.likesCount === 1);
					});
			});
		request(app)
			.put(`/data/post/${post1._id}/like`)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)
			.end((err, res) => {
				Post.findById(post1._id)
					.then((post) => {
						assert(post.likesCount === 1);
						done();
					});
			});
	});

});
