const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const getDataURI = require("../utilities/generateURL");
const cloudinary = require("../utilities/cloudinary");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const mongoose = require("mongoose");

const createPost = asyncHandler(async (req,res) =>{
    const {caption} =req.body;

    const userID = req.user._id;
    const currentUser = await User.findById(req.user._id);

    const file = req.file;
    const fileURI = getDataURI(file);

    //This is for future if video is added.
    // let option
    // const type = req.query.type;
    // if(type ==="video"){
    //     option={
    //         resource_type :"video"
    //     };
    // }else{
    //     option ={};
    // }

    const cloudData = await cloudinary.uploader.upload(fileURI.content);

    const post = await Post.create({
        user: userID,
        caption,
        image :{
            public_id:cloudData.public_id,
            url:cloudData.secure_url,
        },
    })
    await post.save();
    
    currentUser.posts.push(post._id);
    await currentUser.save();

    res.status(201).json({message:"Post created succesfully",post})
})

const deletePost = asyncHandler(async (req,res) =>{
    const post = await Post.findById(req.params.id);
    const image = post._id;
    const currentUser = await User.findById(req.user._id);

    if(!post){
        res.status(404);
        throw new Error("No Post found");
    }
    if (post.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("UnAuthorized");
    }
    
    const deletePostId = currentUser.posts.indexOf(image);

    await cloudinary.uploader.destroy(image);
    currentUser.posts.splice(deletePostId,1);

    await post.deleteOne();
    await currentUser.save();

    res.status(200).json({message:"Post Deleted succesfully"});
})

const getAllPosts = asyncHandler(async(req,res)=>{
    const posts = await Post.find()
                            .select("-user")
                            .sort({createdAt:-1});
    
    res.json({posts});
})

const getPostsById = asyncHandler(async(req,res)=>{
    const friendId = req.params.id;
    const user = await User.findById(req.user._id);
    
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
        res.status(400);
        throw new Error("Invalid friend ID");
    }
    
    const posts = await Post.find({user:friendId}).select("-user").sort({createdAt:-1});
    if(!posts){
        res.status(404);
        throw new Error("No posts found!");
    }

    res.status(200).json({posts, success:true});

})

const getPost = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const posts = await Post.find({user:userId}).select("-user").sort({createdAt:-1});
    if(!posts){
        req.status(404);
        throw new Error("No Posts Found!")
    }
    res.status(200).json({posts, success:true})
})

const getFeedPosts = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const user = await User.findById(userId);
    const friendsId = user?.friends;

    console.log(friendsId);

    const posts = await Post.find({
        $or: [
            { user: userId },      
            { user: { $in: friendsId } } 
        ]
    }).select("-user")
    .sort({ createdAt: -1 }); 

    if(!posts){
        res.status(404);
        throw new Error("No posts found!");
    }

    res.status(200).json({posts, success:true});
})

const upVote = asyncHandler(async(req,res)=>{
    const post = await Post.findById(req.params.id);

    if(!post){
        req.status(404);
        throw new Error("No post found");
    }
    if(post.upvotes.includes(req.user._id)){
        res.status(403);
        throw new Error("Post already upvoted");
    }
    if(post.downvotes.includes(req.user._id)){
        const indexDownvote = post.downvotes.indexOf(req.user._id);
        post.downvotes.splice(indexDownvote,1);
    }

    post.upvotes.push(req.user._id);

    await post.save();
    res.status(200).json({message:"Post upvoted"});
})

const downVote = asyncHandler(async(req,res)=>{
    const post = await Post.findById(req.params.id);

    if(!post){
        req.status(404);
        throw new Error("No post found");
    }
    if(post.downvotes.includes(req.user._id)){
        res.status(403);
        throw new Error("Post already downvoted");
    }
    if(post.upvotes.includes(req.user._id)){
        const indexUpvote = post.downvotes.indexOf(req.user._id);
        post.upvotes.splice(indexUpvote,1);
    }

    post.downvotes.push(req.user._id);

    await post.save();
    res.status(200).json({message:"Post downvoted"});
})

const commentPost = asyncHandler(async(req,res)=>{
    const {comment}= req.body;
    const post = await Post.findById(req.params.id);
    const userId = req.user._id;
    const currentUser = await User.findById(req.user._id);
    
    if(!post){
        res.status(404);
        throw new Error("No post found");
    }

    const Comments = await Comment.create({
        user: userId,
        post:post._id,
        comment,
    });

    currentUser.comments.push(Comments._id);
    post.commentt.push(Comments._id);
    await currentUser.save();
    await post.save();
    res.status(200).json({message:"Comment added successfully"});
})

const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.body; 
    const post = await Post.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    const comment = await Comment.findById(commentId);

    if(!post){
        res.status(404);
        throw new Error("No post found");
    }
    if(!commentId){
        res.status(404);
        throw new Error("Comment Id Missing");
    }
    if(!comment){
        res.status(404);
        throw new Error("Comment Not Found");
    }

    const commentIndexPost = post.commentt.indexOf(comment._id);
    const commentIndexUser = currentUser.comments.indexOf(comment._id);

    if(post.user._id.toString()=== req.user._id.toString || comment.user._id.toString() === req.user._id.toString()){
        await comment.deleteOne();

        post.commentt.splice(commentIndexPost,1);
        currentUser.comments.splice(commentIndexUser,1);

        await post.save();
        await currentUser.save();
    }else{
        res.status(401);
        throw new Error("Unauthorized");
    }

    res.status(200).json({message:"Comment deleted succesfully"});
})

const editCaption = asyncHandler(async(req,res)=>{
    const post = await Post.findById(req.params.id);
    const {newCaption}=req.body;

    if(!post){
        res.status(404);
        throw new Error("No post found");
    }
    if(post.user._id.toString() !== req.user._id.toString()){
        res.status(401);
        throw new Error("Unauthorized");
    }

    post.caption= newCaption;

    await post.save();
    res.status(200).json("Caption updated succesfully");
})

module.exports = {createPost,deletePost,getAllPosts,getPostsById,getPost,getFeedPosts,upVote,downVote,commentPost,deleteComment,editCaption};