const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const myProfile = asyncHandler(async (req,res) =>{
    const user = await User.findById(req.user._id);

    res.json(user);
})

const friend = asyncHandler(async (req,res) =>{
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if(!user){
        res.status(404);
        throw new Error("User not Found");
    }

    if(user._id.toString() === currentUser._id.toString()){
        res.status(403);
        throw new Error("Cannot send friend request to yourself");
    }

    if(currentUser.friends.includes(user._id)){
        res.status(400);
        throw new Error("User is already a friend");
    }

    currentUser.friends.push(user._id);
    user.friends.push(currentUser._id);

    await currentUser.save();
    await user.save();

    res.json({message:"Friend Added"});
})

const unfriend =asyncHandler(async (req,res) =>{
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if(!user){
        res.status(404);
        throw new Error("User not Found");
    }

    if(user._id.toString() === currentUser._id.toString()){
        res.status(403);
        throw new Error("Cannot unfriend yourself");
    }

    if(currentUser.friends.includes(user._id)){
        const indexAddedFriend = currentUser.friends.indexOf(user._id);
        const indexFriend = user.friends.indexOf(currentUser._id);

        currentUser.friends.splice(indexAddedFriend,1);
        user.friends.splice(indexFriend,1);

        await currentUser.save();
        await user.save();

        res.status(200).json({message:"Friend Removed"});
    }else{
        res.status(400);
        throw new Error("No user found in friendlist");
    }
})

const friendList = asyncHandler(async(req,res)=>{
    const currentUser = await User.findById(req.user._id)
                                  .select("-password")
                                  .populate("friends", "-password");

    const friendData = currentUser.friends;
    res.json(friendData);
})
module.exports = {myProfile,friend,unfriend,friendList};

