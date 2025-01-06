const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc Register a user
//@route POST /api/users/register
//@access Public

const registerUsers = asyncHandler(async (req, res) => {
  const user = ({ username, email, password } = req.body);
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists");
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`New user created: ${newUser}`);
  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
  res.json({ message: "Register user" });
});

//@desc login user
//@route GET /api/users/login
//@access Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accesstoken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ accesstoken });
  } else {
    res.status(401);
    throw new Error("Email or password is incorrect");
  }
  res.json({ message: "login user" });
});

//@desc Get current users
//@route GET /api/users/current
//@access Private

const currentUsers = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerUsers,
  currentUsers,
  loginUser,
};
