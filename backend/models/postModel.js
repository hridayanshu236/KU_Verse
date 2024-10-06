const mongoose = require('mongoose');

const postSchema = mongoose.Schema ({
    post :{
        id:String,
        url :String
    },
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
    type : {
        type: String,
        required:true,
    },
    time : {
        type: Date,
        default: Date.now,
    }

})
module.exports = mongoose.model('Post', postSchema);