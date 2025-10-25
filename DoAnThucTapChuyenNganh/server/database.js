const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/ttcn");
    console.log("Kết nối thành công");
  } catch (error) {
    console.log("Kết nối thất bại, Lỗi:", error);
    process.exit(1);
  }
};
module.exports = connectDB;
