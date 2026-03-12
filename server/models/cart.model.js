const mongoose = require("mongoose");
const cartItemSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.ObjectId,
      ref: "courseEntity",
      required: true,
    },
  },
  {
    timestamps: true, //MongoDB tự thêm createdAt và updatedAt
  }
);
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "userEntity",
    required: true,
  },
  items: [cartItemSchema],
});
module.exports = mongoose.model("cartEntity", cartSchema, "carts");
