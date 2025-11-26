const mongoose = require("mongoose");
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  order: { type: Number, required: true },
  videoUrl: { type: String, required: true },
});
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories", //Tham chiếu đến collection categories
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", //Tham chiếu đến collection users
      required: true,
    },
    level: {
      type: String,
      enum: ["cơ bản", "trung cấp", "nâng cao"],
      default: "cơ bản",
    },
    language: { type: String, default: "Tiếng Việt" },
    duration: { type: String, default: "0h0m" },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 }, // Điểm đánh giá trung bình
    totalLessons: { type: Number, default: 0 },
    thumbnail: { type: String, required: true },
    image: { type: String, required: true },
    tags: [{ type: String }],
    objectives: [{ type: String }],
    requirements: [{ type: String }],
    lessons: [lessonSchema],
    isFeatured: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("courseEntity", courseSchema, "course");
