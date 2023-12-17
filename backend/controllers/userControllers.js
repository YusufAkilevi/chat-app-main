const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = async (req, res) => {
  console.log("register");
  try {
    const { name, email, password } = req.body;

    // Check if required fields are provided
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please enter all the fields!");
    }

    // Check if the user already exists in the database
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists!");
    }

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // Check if the user was successfully created
    if (newUser) {
      // If successful, send a response with user details and a token
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        pic: newUser.pic,
        token: generateToken(newUser._id),
      });
    } else {
      // If the user creation fails, send an appropriate error response
      res.status(400);
      throw new Error("Failed to create the user!");
    }
  } catch (err) {
    // Handle any errors that occurred during the process
    console.error(err.message);
    res.send(err.message);
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  try {
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      throw new Error("Invalid Email or Password");
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

module.exports = { registerUser, authUser, allUsers };
