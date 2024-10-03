const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    dateofBirth: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
    },
    clubs:{
        type: [String]
    },
    portfolio:{
        type: String,
    },
    bio: {
        type: String
    },
    skills: {
        type: [String]
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friends'
    }],
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chats'
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }],
});


module.exports =mongoose.model('User', userSchema);