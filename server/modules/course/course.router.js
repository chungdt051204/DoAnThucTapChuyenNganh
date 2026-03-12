const express = require("express");
const router = express.Router();
const coursesController = require("./course.controller");
const multer = require("multer");
const prefix = "";
const cloudinary = require("../../configs/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Course",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 300, height: 400, crop: "limit" }],
  },
});
const upload = multer({ storage });
router.get(`${prefix}/course`, coursesController.getCourse);
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
