const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required:true,
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