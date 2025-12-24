const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, //Để tránh trùng email khi đăng ký
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png",
    },
    phone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["nam", "nữ", "khác"],
      default: "khác",
    },
    dateOfBirth: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true, //MongoDB tự thêm createdAt và updatedAt
  }
);
module.exports = mongoose.model("userEntity", usersSchema, "users");
