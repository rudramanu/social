const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  gender: String,
  password: String,
  role: {
    type: String,
    enum: ["student", "engineer", "doctor"],
    default: "student",
  },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
  UserModel,
};
