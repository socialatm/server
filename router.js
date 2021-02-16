const userServices = require(`${__basedir}/api/user/route/userServices`);
const postServices = require(`${__basedir}/api/post/route/postServices.js`);
const friendshipServices = require(`${__basedir}/api/friendship/route/friendshipServices`);
const commentServices = require(`${__basedir}/api/comment/route/commentServices.js`);
var jwt = require('express-jwt');
const secret = require(`${__basedir}/config/secrets.json`);
const SearchController = require(`${__basedir}/api/search/controller/searchController.js`);

var auth = jwt({
  secret: secret.token
});

module.exports = (app) => {

	// USER services
	userServices(app,auth);

	// POST services
	postServices(app,auth);

	// FRIENDSHIP services
	friendshipServices(app,auth);

	// COMMENTS services
	commentServices(app,auth);

    // Search service
    app.get('/data/search', auth, SearchController.search);
};
