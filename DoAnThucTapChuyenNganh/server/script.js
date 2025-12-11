require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const connectDB = require("./database");
connectDB();
const userEntity = require("./models/user.model");
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
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userEntity.findOne({
          email: profile.emails[0].value,
        });
        if (!user) {
          user = await userEntity.create({
            email: profile.emails[0].value,
            username: profile.displayName,
            avatar: profile.photos[0].value,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
app.listen(port, () => {
  console.log("Server đang chạy với port" + " " + port);
});
