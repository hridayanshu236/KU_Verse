const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const getDataURI = require("../utilities/generateURL");
const cloudinary = require("../utilities/cloudinary");

const createPost = asyncHandler(async (req,res) =>{
    const {caption} =req.body;

    const userID = req.user._id;

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

    res.status(201).json({message:"Post created succesfully",post})
})

module.exports = {createPost};