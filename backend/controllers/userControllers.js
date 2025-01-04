const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt=require("bcrypt");
const getDataURI = require("../utilities/generateURL");
const cloudinary = require("../utilities/cloudinary");
const UserRecommendationSystem = require("../utilities/UserRecommendation");

const myProfile = asyncHandler(async (req,res) =>{
    const user = await User.findById(req.user._id);

    res.json(user);
})

const updateProfilePicture = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    
    const fileURI = getDataURI(req.file);

   
    const cloudinaryResponse = await cloudinary.uploader.upload(
      fileURI.content,
      {
        folder: "profile_pictures",
        transformation: [
          { width: 400, height: 400, crop: "fill" },
          { quality: "auto" },
        ],
      }
    );

    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: cloudinaryResponse.secure_url },
      { new: true }
    ).select("profilePicture fullName");

    if (!updatedUser) {
      // Clean up the uploaded image if user update fails
      await cloudinary.uploader.destroy(cloudinaryResponse.public_id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

   
    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    console.error("Profile picture update error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile picture",
      error: error.message,
    });
  }
});

const viewUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password") // Exclude password from the response
    .populate("friends", "-password"); // Populate friends without their passwords

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("Use /profile/me route to view your own profile");
  }

  res.json(user);
});

const getAllUsers = asyncHandler(async (req, res) => {
    const searchQuery = req.query.search;
    let query = {};
  
    if (searchQuery) {
      query.fullName = { $regex: searchQuery, $options: "i" };
    }
  
    const users = await User.find(query)
      .select("fullName profilePicture department")
      .limit(10) // Limit results for better performance
      .lean();
  
    res.json({ users });
  });

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

const updateProfile = asyncHandler(async (req,res)=>{
    const profile = req.user._id;
    const updates = req.body; 

    if ("password" in updates|| "email" in updates) {
        res.status(400);
        throw new Error("Password and email cannot be updated through this route");
    }

    const updatedUser = await User.findByIdAndUpdate(profile, updates, { new: true });

    if (!updatedUser) {
         res.status(404);
        throw new Error("Invalid User ID");
    }

    res.status(200).json({message:"Profile Updated Successfully"});
})

const updatePassword = asyncHandler(async(req,res) =>{
    const user = await User.findById(req.user._id);

    const{oldPassword,newPassword}= req.body;
    const comparePassword = await bcrypt.compare(oldPassword, user.password);
    if(!comparePassword){
        res.status(400);
        throw new Error("Incorrect old password");
    }
  
    user.password = await bcrypt.hash(newPassword,10);
   
    await user.save();
    res.status(200).json({message:"Password updated successfully"});
})

const recommendationSystem = new UserRecommendationSystem();

const getRecommendations = asyncHandler(async (req, res) => {
  try {
    
    const limit = parseInt(req.query.limit) || 10;

    
    const recommendations = await recommendationSystem.getRecommendations(
      req.user._id,
      limit
    );

    // Return recommendations
    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recommendations",
      error: error.message,
    });
  }
});

// Optional: Add an endpoint to update recommendation weights
const updateRecommendationWeights = asyncHandler(async (req, res) => {
  try {
    const { department, skills } = req.body;

    // Validate weights sum to 1
    if (department + skills !== 1) {
      res.status(400);
      throw new Error("Weights must sum to 1");
    }

    // Update weights
    recommendationSystem.updateWeights({
      department,
      skills,
    });

    res.status(200).json({
      success: true,
      message: "Recommendation weights updated successfully",
      weights: recommendationSystem.weights,
    });
  } catch (error) {
    console.error("Weight update error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating weights",
      error: error.message,
    });
  }
});
const getMutualConnections = async (req, res) => {
  try {
    const { userId } = req.params; // ID of the user we're comparing with
    const currentUserId = req.user._id; // Assuming you have user info in req.user from auth middleware

    // Fetch both users' friends lists in parallel
    const [currentUserFriends, otherUserFriends] = await Promise.all([
      User.findById(currentUserId).select('friends').populate('friends', '_id'),
      User.findById(userId).select('friends').populate('friends', '_id')
    ]);

    if (!currentUserFriends || !otherUserFriends) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert friends arrays to Sets of friend IDs
    const currentUserFriendSet = new Set(
      currentUserFriends.friends.map(friend => friend._id.toString())
    );
    const otherUserFriendSet = new Set(
      otherUserFriends.friends.map(friend => friend._id.toString())
    );

    // Calculate mutual connections
    let mutualCount = 0;
    for (const friendId of currentUserFriendSet) {
      if (otherUserFriendSet.has(friendId)) {
        mutualCount++;
      }
    }

    return res.json({ mutualConnections: mutualCount });
  } catch (error) {
    console.error('Error calculating mutual connections:', error);
    return res.status(500).json({ 
      message: 'Error calculating mutual connections',
      error: error.message 
    });
  }
};

// If you also want to get the mutual friends' details:
const getMutualFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const [currentUserFriends, otherUserFriends] = await Promise.all([
      User.findById(currentUserId)
        .select('friends')
        .populate('friends', '_id fullName profilePicture department'),
      User.findById(userId)
        .select('friends')
        .populate('friends', '_id fullName profilePicture department')
    ]);

    if (!currentUserFriends || !otherUserFriends) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert one user's friends to a Map for O(1) lookup
    const currentUserFriendMap = new Map(
      currentUserFriends.friends.map(friend => [friend._id.toString(), friend])
    );

    // Find mutual friends
    const mutualFriends = otherUserFriends.friends.filter(friend => 
      currentUserFriendMap.has(friend._id.toString())
    );

    return res.json({
      mutualConnections: mutualFriends.length,
      mutualFriends: mutualFriends
    });
  } catch (error) {
    console.error('Error getting mutual friends:', error);
    return res.status(500).json({ 
      message: 'Error getting mutual friends',
      error: error.message 
    });
  }
};


module.exports = {myProfile,updateProfilePicture,viewUserProfile,getAllUsers,friend,unfriend,friendList,updateProfile,updatePassword,getRecommendations,updateRecommendationWeights,getMutualConnections,getMutualFriends};

