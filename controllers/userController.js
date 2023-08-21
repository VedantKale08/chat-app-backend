const { generateToken } = require("../config/generateToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  const { fname, lname, email, gender, password, image} = req.body;
  if (!fname || !lname || !email || !gender || !password || !image) {
    res.status(400);
    throw new Error("Something went wrong!");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(200).json({
      error: "User Already Exists!",
      status: false,
    });
  }

  const user = await User.create({
    fname,
    lname,
    email,
    gender,
    password,
    image
  });

  if (user) {
    res.status(200).json({
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      gender: user.gender,
      image: user.image,
      token: generateToken(user._id),
      status: true,
    });
  } else {
    res.status(200).json({
      error: "Failed to create a user!",
      status: false,
    });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      gender: user.gender,
      image: user.image,
      token: generateToken(user._id),
      status: true,
    });
  } else {
    res.status(200).json({
      error: "User not found!",
      status: false,
    });
  }
});

const allUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { fname: { $regex: req.query.search, $options: "i" } },
          { lname: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } }).select('-password');

   res.status(200).send(users);
});

const getUser = asyncHandler(async (req, res) => {
  const users = await User.findOne({ _id: req.user._id }).select("-password");
  res.status(200).send(users);
});

module.exports = { registerUser, authUser, allUser, getUser };
