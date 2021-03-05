const UserController = require(`${__basedir}/api/user/controller/userController.js`);
const Authentication = require(`${__basedir}/api/services/auth/authentication.js`);
const multer = require("multer")();

module.exports = (app, auth) => {
	// Register a new user - creates a new user from the given request.body object
	app.post('/data/register', UserController.create);

	// Login an existing user
	app.post('/data/login', Authentication.login);

	// Get all users - returns a list of users filtered by given criteria
	app.get('/data/user', auth, UserController.getUsers);

	// Get user by ID - returns one user wih given id
	app.get('/data/user/:id', auth, UserController.getUser);

	// Get all posts of one user - returns all posts of given user
	app.get('/data/user/:id/posts', auth, UserController.getPosts);

	// Get all friends for user - returns all friends of given user
	app.get('/data/user/:id/friends', auth, UserController.getFriends);

	// PUT a new image - add an profile avatar for given user
	app.put('/data/user/img/:id', auth, multer.single("image"), UserController.addImage);

	// PUT user - updates a given user
	app.put('/data/user/:id', auth, UserController.update);

	// Delete user - deletes a given user
	app.delete('/data/user/:id', auth, UserController.remove);
}
