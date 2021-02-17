const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    author: {
        type: Schema.Types.ObjectId,
        required: [true, 'Author is required'],
        ref: 'user'
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
});

CommentSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});

CommentSchema.virtual('created').get( function () {
    return this._id.getTimestamp();
});

const Comment = mongoose.model('comment', CommentSchema);
module.exports = Comment;
