const Post = require(`${__basedir}/api/post/model/post.js`);
const Comment = require(`${__basedir}/api/comment/model/comment.js`);
const User = require(`${__basedir}/api/user/model/user.js`);

const create = (req, res) => {
    const comment = new Comment({
        content: req.body.content,
        author: req.user._id
    });
    comment.save()
        .then((commentFound) => {
            Post.findByIdAndUpdate(req.params.postId, {
                $addToSet: {
                    "comments": commentFound._id
                },
                $set: {
                    "updated": new Date().getTime()
                }
            }, {
                new: true
            })
                .populate({
                    path: 'comments',
                    model: 'comment',
                    populate: {
                        path: 'author',
                        model: 'user',
                        select: 'username +_id + avatar'
                    }
                })
                .then((post) => {
                    const comments = post.comments;
                    comments.sort((a, b) => {
                        return b.updated < a.updated;
                    });
                    res.status(200).json(comments);
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            res.status(500).json(error);
        });
}

const update = (req, res) => {
    Comment.findByIdAndUpdate(req.params.id, req.body)
        .then((post) => {
            if (post) {
                res.send('OK')
            } else {
                res.status(404).send('comment not found');
            }
        })
        .catch((error) => {
            res.json(error);
        });
}

const remove = (req, res) => {
    Comment.findByIdAndRemove(req.params.id)
        .then(() => {
            res.send('OK')
        })
        .catch((error) => {
            res.status(500).json(error);
        });
}

const addLike = (req, res) => {
    Comment.findByIdAndUpdate(req.params.id, {
        $addToSet: {
            "likes": req.user._id
        }
    })
        .then(() => {
            Post.findOne({
                comments: req.params.id
            })
                .then((post) => {
                    if (post.author.toString() !== req.user._id) {
                        User.findByIdAndUpdate(req.user._id, {
                            $addToSet: {
                                "followingPosts": req.params.id
                            }
                        })
                            .then(() => {
                                res.json('OK');
                            });
                    } else {
                        res.json('OK');
                    }
                });
        })
        .catch((error) => {
            res.status(500).json(error);
        });
}

module.exports = {
    create,
    update,
    remove,
    addLike
};