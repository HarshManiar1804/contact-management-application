const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Please add the username"],
    },
    email: {
      type: String,
      require: [true, "Please add the user Email"],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      require: [true, "Please add the user password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
