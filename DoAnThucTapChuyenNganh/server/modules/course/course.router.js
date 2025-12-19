const express = require("express"); //Import thư viện express
const router = express.Router();
const coursesController = require("./course.controller");
const multer = require("multer"); //Import thư viện multer
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
// Routes GET: Lấy dữ liệu khóa học
router.get(`${prefix}/course`, coursesController.getCourse);

// Route tìm kiếm gợi ý
router.get(`${prefix}/course/search/suggestion`, coursesController.getCourse);
// POST: Thêm khóa học mới (với upload.single("image") middleware)
router.post(
  `${prefix}/course`,
  upload.single("image"),
  coursesController.postCourse
);
// PUT: Cập nhật khóa học (ảnh là tùy chọn, với upload.single("image") middleware)
router.put(
  `${prefix}/course`,
  upload.single("image"),
  coursesController.putCourse
);
// DELETE: Xóa khóa học
router.delete(`${prefix}/course`, coursesController.deleteCourse);
module.exports = router;
