const mongoose = require('mongoose');

const postSchema = mongoose.Schema ({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    upvotes : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    downvotes : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    caption : {
        type: String,
    },
    image : {
        public_id: {
            type: String,
            required:true,
        },
        url :{
            type: String,
            required:true,
        }
        
    },
    commentt:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ],
    time : {
        type: Date,
        default: Date.now,
    }

})
module.exports = mongoose.model('Post', postSchema);