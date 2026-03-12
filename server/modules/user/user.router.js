const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const multer = require("multer");
const prefix = "";
const cloudinary = require("../../configs/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "User",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 300, height: 400, crop: "limit" }],
  },
});
const upload = multer({ storage });
router.get(`${prefix}/auth/google`, userController.getLoginGoogle);
router.get(
  `${prefix}/auth/google/callback`,
  userController.getResultLoginGoogle
);
router.post(
  `${prefix}/register`,
  upload.single("avatar"),
  userController.postRegister
);
router.post(`${prefix}/login`, userController.postLogin);
router.get(`${prefix}/me`, userController.getMe);
router.put(`${prefix}/me/:id`, upload.single("avatar"), userController.putUser);
router.get(`${prefix}/user`, userController.getUser);
router.put(`${prefix}/user/:id`, userController.putStatusUser);
router.delete(`${prefix}/user/:id`, userController.deleteUser);
module.exports = router;
