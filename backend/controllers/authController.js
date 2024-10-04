const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generate_jwt = require("../utilities/generateToken");
const bcrypt = require("bcrypt");

const registerUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    userName,
    fullName,
    phoneNumber,
    dateofBirth,
    address,
    department,
  } = req.body;
  if (
    !email ||
    !password ||
    !userName ||
    !fullName ||
    !phoneNumber ||
    !dateofBirth ||
    !address ||
    !department
  ) {
    res.status(400).json({ messsage: "All Field Mandatory" });
  }
  let user = await User.findOne({ email });

  if (user) {
    res.status(400).json({ messsage: "User already registered" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    email,
    password: hashedPassword,
    userName,
    fullName,
    phoneNumber,
    dateofBirth,
    address,
    department,
  });
  generate_jwt(user._id, res);
  console.log("User Registered");
  res.status(201).json({
    message: "User Registered",
    user,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ messsage: "All Field Mandatory" });
  }
  const user = await User.findOne({ email });

  const comparePassword = await bcrypt.compare(password, user.password);

  if (user && comparePassword) {
    generate_jwt(user._id, res);
    console.log("Login successful");
    res.status(200).json({ message: "Login successful", user });
  } else {
    res.status(401).json({ message: "Email or password invalid." });
  }
});

const logoutUser = asyncHandler(async (req,res) =>{
  res.cookie("token", "", {maxAge:0});

  res.json({
    message:"Logout Succesfull"
  });
})

module.exports = { registerUser, loginUser,logoutUser };
