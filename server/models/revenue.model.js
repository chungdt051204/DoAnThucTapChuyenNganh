const mongoose = require("mongoose");
const revenueSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courseEntity",
    },
    courseName: {
      type: "String",
      required: true,
    },
    totalAmount: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("revenueEntity", revenueSchema, "revenues");
