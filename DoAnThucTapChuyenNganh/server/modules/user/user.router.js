const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const multer = require("multer");

// Multer storage for user avatars (same folder as in script.js)
const storageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images/user/");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const uploadUser = multer({ storage: storageUser });
const prefix = "";
router.post(`${prefix}/login`, userController.postLogin);
router.get(`${prefix}/me`, userController.getUser);
router.put(
  `${prefix}/me`,
  uploadUser.single("avatar"),
  userController.updateUser
);
router.delete(`${prefix}/me`, userController.logout);
module.exports = router;
