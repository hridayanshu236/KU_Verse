const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const getDataURL = require("../utilities/generateURL");
const cloudinary = require("cloudinary");

const createPost = asyncHandler(async (req,res) =>{
    const {caption} =req.body;

    const userID = req.user._id;

    // const file = req.file;
    // const fileURL = getDataURL(file);

    let option
    const type = req.query.type;
    if(type ==="video"){
        option={
            resource_type :"video"
        };
    }else{
        option ={};
    }
    //const cloudData = await cloudinary.v2.uploader.upload(fileURL.content,option);

    const post = await Post.create({
        user:userID,
        caption,
        type,
    })
    await post.save();

    res.status(201).json({message:"Post created succesfully",post})
})

module.exports = {createPost};