const connectDB = require("./database");
connectDB();
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
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
app.listen(port, () => {
  console.log("Server đang chạy với port" + " " + port);
});
