const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    comment: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    }
})
module.exports = mongoose.model('Comment', commentSchema);