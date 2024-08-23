const express = require("express");
const User = require("../Models/UserModel");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation for checking inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Finding user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Matching password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password does not match" });
    }

    // Password is correct, create JWT token
    const accessToken = jwt.sign(
      {
        name: user.username,
        userId: user._id,
        email: user.email,
        accountType: user.accountType,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Optional: Token expiration time
    );

    // Respond with the token, user details, and account type
    res.status(200).json({
      accessToken,
      user: {
        name: user.username,
        email: user.email,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed", details: error.message });
  }
};

// Register function
const registerUser = async (req, res) => {
  try {
    const { fullName, username, password, email, mobileNumber, accountType } =
      req.body;

    // Validation
    if (
      !fullName ||
      !username ||
      !password ||
      !email ||
      !mobileNumber ||
      !accountType
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10); // Using a higher salt value for better security
    const hashedPassword = await bcrypt.hash(password, salt);

    // Storing the new user data
    const user = new User({
      fullName,
      username,
      password: hashedPassword,
      email,
      mobileNumber,
      accountType,
    });

    await user.save();

    // Registration done, create JWT token
    const accessToken = jwt.sign(
      { name: user.username, userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Optional: Token expiration time
    );

    res.status(201).json({
      success: true,
      message: "Registration is successful",
      accessToken,
      user: { name: user.username },
      accountType: { type: user.accountType },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUser, login };
