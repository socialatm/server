const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const LikesSchema = require('./likes');

const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    mediaType: {
        type: String
    },
    media: String,
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    updated: { type: Number }
    }, {
    usePushEach: true
});

// used for searches
PostSchema.index({ '$**': 'text' });

PostSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

PostSchema.pre('save', function (next) {
    this.updated = new Date().getTime();
    next();
});

PostSchema.pre('update', function (next) {
    this.updated = new Date().getTime();
    next();
});

PostSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});

PostSchema.methods.setMedia = function (url, type) {
    this.media = url;
    this.mediaType = type;
}

const Post = mongoose.model('post', PostSchema);
module.exports = Post;
