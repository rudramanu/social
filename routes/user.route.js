const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const { BlacklistModel } = require("../models/blacklist.model");

userRouter.post("/register", (req, res) => {
  const { name, email, gender, password } = req.body;
  try {
    bcrypt.hash(password, 3, async (err, encrypt_password) => {
      if (err) {
        console.log(err);
      } else {
        const user = new UserModel({
          name,
          email,
          gender,
          password: encrypt_password,
        });
        await user.save();
        res.send("Registered");
      }
    });
  } catch (error) {
    res.send("Error while registering", error);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    const hashed_password = user?.password;

    bcrypt.compare(password, hashed_password, (err, result) => {
      if (result) {
        const token = jwt.sign({ userID: user._id, role: user.role }, "coder");
        res.send({ message: "Logged in successfully", token: token });
      } else {
        res.send("Wrong credentials");
      }
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

userRouter.get("/logout", async (req, res) => {
  const token = req.headers.authorization;
  const addtoken = new BlacklistModel({ token });
  await addtoken.save();
  res.send("logged out successfully");
});

module.exports = {
  userRouter,
};
