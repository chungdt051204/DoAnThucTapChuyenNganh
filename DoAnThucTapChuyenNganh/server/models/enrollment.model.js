const mongoose = require("mongoose");
const enrollmentSchema = new mongoose.Schema(
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
    accessLevel: {
      type: String,
      enum: ["LIMITED", "UNLIMITED"],
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model(
  "enrollmentEntity",
  enrollmentSchema,
  "enrollments"
);
