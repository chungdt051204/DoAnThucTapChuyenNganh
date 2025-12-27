const mongoose = require("mongoose");
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  order: { type: Number, required: true },
  videoUrl: { type: String, required: true },
  isPreview: { type: Boolean, default: true },
});
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categoryEntity", //Tham chiếu đến collection category
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    totalLessons: { type: Number, default: 0 },
    thumbnail: { type: String },
    image: { type: String },
    objectives: [{ type: String }],
    requirements: [{ type: String }],
    lessons: [lessonSchema],
    isFeatured: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("courseEntity", courseSchema, "course");
