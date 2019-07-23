const mongoose = require("mongoose");
// Initialize mongoose Schema
const Schema = mongoose.Schema;
// Setup signup user schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      unique: false,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      unique: false,
      trim: true,
      required: true
    },
    emailId: {
      type: String,
      unique: true,
      trim: true,
      required: true
    },
    phoneNo: {
      type: String,
      unique: true,
      trim: true,
      required: true
    },
    password: {
      type: String,
      unique: false,
      trim: true,
      required: true
    },
    status: {
      type: Boolean,
      default: true
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Export signup user model
let User = mongoose.model("users", userSchema);
module.exports = User;
