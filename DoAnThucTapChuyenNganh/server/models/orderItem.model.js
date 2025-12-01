const mongoose = require("mongoose");
const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.ObjectId,
    ref: "order",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: "course",
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  priceAtPurchase: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
});
module.exports = mongoose.model(
  "orderItemEntity",
  orderItemSchema,
  "orderItem"
);
