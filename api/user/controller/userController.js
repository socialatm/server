const User = require(`${__basedir}/api/user/model/user.js`);
const Friendship = require(`${__basedir}/api/friendship/model/friendship.js`);
const aws = require(`${__basedir}/api/services/awsS3/awsS3.js`);

const postPopQuery = [{
    path: 'comments',
    model: 'comment',
    populate: {
        path: 'author',
        model: 'user',
        select: 'username +_id + avatar'
    }
},
    {
    path: 'author',
    model: 'user',
    select: 'username +_id + avatar'
}];

const create = (req, res) => {
    User.create(req.body)
        .then((user) => {
            user.password = "youdontneedtoknow";
            res.json(user);
        })
        .catch((error) => {
            if (error.code === 11000) {
                res.status(406, "username, phonenumber or email are already taken");
            }
            res.status(500).json(error);
        });
}

const getUsers = (req, res) => {
    User.find(req.query).select('_id + username')
        .then((users) => {
            res.json(users);
        })
        .catch((error) => {
            res.json(error);
        });
}

const getUser = (req, res) => {
    if (!req.query.includePosts) {
        User.findById(req.params.id)
            .then((user) => {
                if (user !== null) {
                    if (!user.avatar) user.avatar = "http://placehold.it/160x220";
                    res.json(user);
                } else {
                    res.status(404).json('nothing found');
                }
            })
            .catch((error) => {
                res.status(404);
                res.json(error);
            });
    } else {
        User.findById(req.params.id)
            .populate({
                path: 'posts',
                model: 'post',
                populate: postPopQuery
            })
            .then((user) => {
                if (user !== null) {
                    res.json(user);
                } else {
                    res.status(404).json('nothing found');
                }
            })
            .catch((error) => {
                res.status(404);
                res.json(error);
            });
    }
}

const getPosts = (req, res) => {
    User.findById(req.params.id)
        .populate({
            path: 'posts',
            model: 'post',
            populate: postPopQuery
        })
        .populate({
            path: 'followingPosts',
            model: 'post',
            populate: postPopQuery
        })
        .then((user) => {
            const posts = user.followingPosts.concat(user.posts);
            posts.sort((a, b) => {
                return b.updated - a.updated;
            });
            res.json(posts);
        })
        .catch((error) => {
            res.json(error);
        });
}

const getFriends = (req, res) => {
  Friendship.find({
    $or: [{
      userOne: req.params.id
    }, {
      userTwo: req.params.id
    }]
  })
    .sort({
      _id: -1
    })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json(error);
    })
}

const update = (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .then((user) => {
            if (user) {
                res.send('OK');
            } else {
                res.status(404);
            }
        })
        .catch((error) => {
            res.json(error);
        });
}

const remove = (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then((data) => {
            if (data.avatar !== '') {
                aws.deleteS3('socialatm', data._id.toString())
                    .then((data) => {
                        res.send('OK');
                    })
                    .catch((err) => {
                        res.status(404).json('could not find users image');
                    })
            } else {
                res.send('OK');
            }
        })
        .catch((error) => {
            res.json(error);
        });
}

const addImage = (req, res) => {
    // bucketName, file, contentType, title
    aws.uploadS3('socialatm', req.file.buffer, req.file.mimetype, req.params.id + new Date().getTime())
        .then((data) => {
            User.findByIdAndUpdate(req.params.id, {
                avatar: data.Location
            }, { new: true })
                .then((user) => {
                    if (user) {
                        // res.send('OK');
                        res.json(user.avatar);
                    } else {
                        res.status(404);
                    }
                })
                .catch((error) => {
                    res.json(error);
                });
        });
}

module.exports = {
    create,
    remove,
    update,
    getUser,
    getUsers,
    getPosts,
    getFriends,
    addImage
}
