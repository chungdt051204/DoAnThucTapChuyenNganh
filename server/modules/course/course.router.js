const express = require("express");
const router = express.Router();
const coursesController = require("./course.controller");
const multer = require("multer");
const prefix = "";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images/course/");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });
router.get(`${prefix}/course`, coursesController.getCourse);
router.get(`${prefix}/course/search/suggestion`, coursesController.getCourse);
router.post(
  `${prefix}/course`,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  coursesController.postCourse
);
router.put(
  `${prefix}/course`,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  coursesController.putCourse
);
router.delete(`${prefix}/course`, coursesController.deleteCourse);
module.exports = router;
