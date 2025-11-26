const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, //Để tránh trùng email khi đăng ký
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png",
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["nam", "nữ", "chưa chọn"],
      default: "chưa chọn",
    },
    dateOfBirth: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["user", "instructor", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
  },
  {
    timestamps: true, //MongoDB tự thêm createdAt và updatedAt
  }
);
module.exports = mongoose.model("userEntity", usersSchema, "user");
