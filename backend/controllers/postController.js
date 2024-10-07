const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const getDataURI = require("../utilities/generateURL");
const cloudinary = require("../utilities/cloudinary");
const User = require("../models/userModel");

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
        res.status(403);
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
module.exports = {createPost,deletePost,getAllPosts};