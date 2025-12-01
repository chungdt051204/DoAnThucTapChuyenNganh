const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    totalAmount: {
      type: mongoose.Types.Decimal128, //Khai báo kiểu dữ liệu Decimal do mongoose hỗ trợ
    },
    status: {
      type: String,
      enum: ["cart", "completed", "cancelled"],
      default: "cart",
    },
    purchaserName: {
      type: String,
    },
    purchaserEmail: {
      type: String,
    },
    orderDate: {
      type: Date,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("orderEntity", orderSchema, "order");
