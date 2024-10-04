const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const myProfile = asyncHandler(async (req,res) =>{
    const user = await User.findById(req.user._id);

    res.json(user);
})

module.exports = {myProfile};

