const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "userEntity",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.ObjectId,
      ref: "courseEntity",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("reviewEntity", reviewSchema, "reviews");
