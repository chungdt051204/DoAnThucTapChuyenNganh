const connectDB = require("./database");
const userEntity = require("./models/user.model");
const courseEntity = require("./models/course.model");
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
//Lưu trữ ảnh user vô thư mục public/images/user bằng multer
const storageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images/user/");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const uploadUser = multer({ storage: storageUser });
app.post("/register", uploadUser.single("avatar"), async (req, res) => {
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
//Lưu trữ ảnh khóa học vô thư mục public/images/course bằng multer
const storageCourse = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images/course/");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const uploadCourse = multer({ storage: storageCourse });
app.post(
  "/admin/course",
  uploadCourse.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, categoryId, price } = req.body;
      await courseEntity.create({
        title: title,
        categoryId: categoryId,
        price: price,
        image: req.files["image"][0].filename,
        thumbnail: req.files["thumbnail"][0].filename,
      });
      res.status(200).json({ message: "Thêm mới khóa học thành công" });
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình thêm dữ liệu", error);
      res.status(500).json({ message: "Thêm dữ liệu thất bại, error", error });
    }
  }
);
app.put(
  "/admin/course",
  uploadCourse.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.query;
      const { title, categoryId, price } = req.body;
      await courseEntity.updateOne(
        { _id: id },
        {
          title: title,
          categoryId: categoryId,
          price: price,
          image: req.files["image"][0].filename,
          thumbnail: req.files["thumbnail"][0].filename,
        }
      );
      res.status(200).json({ message: "Cập nhật khóa học thành công" });
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình cập nhật dữ liệu", error);
      res
        .status(500)
        .json({ message: "Cập nhật dữ liệu thất bại, error", error });
    }
  }
);
app.listen(port, () => {
  console.log("Server đang chạy với port", port);
});
