const connectDB = require("./database");
const userEntity = require("./models/user.model");
connectDB();
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const multer = require("multer");
//Thứ tự đặt: cors, cookie-parser, body-parser, router
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const cookiesParser = require("cookie-parser");
app.use(cookiesParser());
app.use(express.json());
const userRouter = require("./modules/user/user.router");
const courseRouter = require("./modules/course/course.router");
const categoryRouter = require("./modules/category/category.router");
const cartRouter = require("./modules/cart/cart.router");
app.use("/", userRouter);
app.use("/", courseRouter);
app.use("/", categoryRouter);
app.use("/", cartRouter);
//Thêm dòng này để sử dụng đc ảnh phía server
app.use(express.static("public"));
//Lưu trữ file vô ổ đĩa bằng multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });
app.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { body } = req;
    //Kiểm tra trùng email
    const existingUser = await userEntity.findOne({ email: body.email });
    if (existingUser)
      return res.status(400).json({ message: "Email này đã tồn tại" });
    //Nếu chưa có thì thêm mới
    await userEntity.create({ ...body, avatar: req.file && req.file.filename });
    return res.status(200).json({ message: "Đăng ký tài khoản thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra trong quá trình đăng ký", error);
    res.status(500).json({ message: "Đăng ký tài khoản thất bại" });
  }
});
app.listen(port, () => {
  console.log("Server đang chạy với port", port);
});
