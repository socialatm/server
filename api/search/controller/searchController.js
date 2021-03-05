const Post = require(`${__basedir}/api/post/model/post.js`);
const User = require(`${__basedir}/api/user/model/user.js`);
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

const search = function (req, res) {
    Promise.all([
        Post.find({ $text: { $search: req.query.string } }, { score: { $meta: "textScore" } }).populate(postPopQuery),
        User.find({ $text: { $search: req.query.string } }, { score: { $meta: "textScore" } })
        ])
        .then((data) => {
           const result = data[1].concat(data[0]);
           result.sort((a, b) => {
                return a.score - b.score;
           })
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
}

module.exports = {
    search
}
