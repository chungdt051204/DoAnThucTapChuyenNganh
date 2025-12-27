const mongoose = require("mongoose");
const orderItemSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: "courseEntity",
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  coursePrice: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ["FULL", "PARTIAL"],
    required: true,
  },
  appliedAmount: {
    // Số tiền phải trả cho item này trong đơn hàng này
    type: Number,
    required: true,
  },
});
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "userEntity",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["partially_paid", "fully_paid"],
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "simulation",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("orderEntity", orderSchema, "orders");
