const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generate_jwt = require("../utilities/generateToken");
const bcrypt = require("bcrypt");
const { sendVerificationEmail } = require("../utilities/emailUtility");
const getDataURI = require("../utilities/generateURL");
const cloudinary = require("../utilities/cloudinary");

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
    return res.status(400).json({ message: "All fields are mandatory." });
  }

  let cloudData = null;
  if (req.file) {
    console.log("Processing file upload");
    try {
      const fileURI = getDataURI(req.file);
      if (!fileURI || !fileURI.content) {
        throw new Error("Failed to process uploaded file");
      }
      cloudData = await cloudinary.uploader.upload(fileURI.content);
      console.log("File uploaded to Cloudinary successfully");
    } catch (error) {
      console.error("File upload error:", error);
      return res.status(500).json({
        message: "Error uploading profile picture",
        error: error.message,
      });
    }
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already registered." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  user = await User.create({
    email,
    password: hashedPassword,
    userName,
    fullName,
    phoneNumber,
    dateofBirth,
    address,
    profilePicture:
      cloudData?.secure_url || "https://www.gravatar.com/avatar/?d=mp",
    department,
    verificationToken: verificationToken,
    verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000,
  });

  generate_jwt(user._id, res);

  await sendVerificationEmail(user.email, verificationToken);

  console.log("User Registered");
  res.status(201).json({
    message: "User Registered",
    user,
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification code",
    });
  }
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Email verified successfully" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ messsage: "All Field Mandatory" });
  }
  const user = await User.findOne({ email });

  const comparePassword = await bcrypt.compare(password, user.password);

  if (user && comparePassword) {
    const isVerified = user.isVerified;
    if (!isVerified) {
      res.status(400).json({ success: false, message: "Email not verified" });
    }
    const token = generate_jwt(user._id, res);

    res.status(200).json({ message: "Login successful", user });
    console.log("Login successful");
  } else {
    res.status(401).json({ message: "Email or password invalid." });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(200).json({
    message: "Logout successful",
  });
});

module.exports = { registerUser, loginUser, logoutUser, verifyEmail };
