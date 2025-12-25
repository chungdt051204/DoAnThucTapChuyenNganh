const mongoose = require("mongoose"); //Import thư viện mongoose
const connectDB = async () => {
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/ttcn"); //ttcn là tên database
    console.log("Kết nối thành công");
  } catch (error) {
    console.log("Kết nối thất bại, Lỗi:", error);
    process.exit(1);
  }
};
module.exports = connectDB;
