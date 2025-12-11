const express = require("express"); //Import thư viện express
const router = express.Router();
const userController = require("./user.controller");
const multer = require("multer"); //Import thư viện multer
const prefix = "";
//Lưu trữ ảnh user vô thư mục public/images/user bằng multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images/user/");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
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
router.get(`${prefix}/me`, userController.getUser);
router.put(`${prefix}/me/:id`, upload.single("avatar"), userController.putUser);
router.get(`${prefix}/users`, userController.getAllUsers);
router.get(`${prefix}/users/role`, userController.getUsersWithRole);
router.put(`${prefix}/admin/user/:id`, userController.putStatusUser);
router.delete(`${prefix}/me`, userController.logout);
router.delete(`${prefix}/admin/user/:id`, userController.deleteUser);
module.exports = router;
