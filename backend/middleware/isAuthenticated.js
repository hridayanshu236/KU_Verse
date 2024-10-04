const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const isAuth = asyncHandler(async (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        res.status(403);
        throw new Error("Unauthorized");
    }
    const data = jwt.verify(token ,process.env.access_token_jwt);

    if(!data){
        res.status(400);
        throw new Error("Token Expired");
    }

    req.user = await User.findById(data.id);
    next();
})

module.exports ={isAuth};