const User = require ("../models/userModel");
const asyncHandler = require("express-async-handler");
const generate_jwt = require("../utilities/generateToken");

const registerUser = asyncHandler(async (req,res)=>{
    const {email,password, userName,fullName, phoneNumber,dateofBirth,address,department}=req.body;
    if(!email || !password || !userName || !fullName || !phoneNumber || !dateofBirth || !address || !department){
        res.status(400).json({messsage:"All Field Mandatory"});
    }
    let user = User.findOne({email});

    if(user){
        res.status(400).json({messsage:"User already registered"});
    }
    const hashedPassword = await bcrypt.hash(password,10);

    user = await User.create({
        email,password: hashedPassword, userName,fullName, phoneNumber,dateofBirth,address,department
    });
    generate_jwt(user._id,res);

    res.status(201).json({
        message:"User Registered",
        user,
    })
});

const loginUser = asyncHandler(async (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400).json({messsage:"All Field Mandatory"});
    }
    const user = User.findOne({email});

    const comparePassword =await bcrypt.compare(password.user.password);

    if(user && comparePassword ){
        generate_jwt(user._id,res);
    }else{
        res.status(401).json({message : "Email or password invalid."})
    }
})



module.exports ={ registerUser, loginUser};