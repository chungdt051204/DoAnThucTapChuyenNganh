const express = require("express"); //Import thư viện express
const router = express.Router();
const coursesController = require("./course.controller");
const multer = require("multer"); //Import thư viện multer

const prefix = "";

/**
 * Cấu hình multer để lưu trữ ảnh khóa học
 * - destination: Lưu ảnh vào thư mục ./public/images/course/
 * - filename: Tên file = timestamp + tên file gốc (để tránh trùng tên)
 */
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
router.get(`${prefix}/courses`, coursesController.getCourses); // Lấy tất cả hoặc lọc theo danh mục
router.get(`${prefix}/course-free`, coursesController.getCoursesFree); // Lấy khóa học miễn phí
router.get(`${prefix}/course-pre`, coursesController.getCoursesPre); // Lấy khóa học trả phí
router.get(`${prefix}/course`, coursesController.getCourses); // Lấy chi tiết khóa học

// Route tìm kiếm gợi ý
router.get(
  `${prefix}/courses/search/suggestion`,
  coursesController.getCoursesWithSearchSuggestion
);

// Routes POST, PUT, DELETE: Quản lý khóa học (Admin)
// POST: Thêm khóa học mới (với upload.single("image") middleware)
router.post(
  `${prefix}/admin/course`,
  upload.single("image"),
  coursesController.postCourse
);

// PUT: Cập nhật khóa học (ảnh là tùy chọn, với upload.single("image") middleware)
router.put(
  `${prefix}/admin/course`,
  upload.single("image"),
  coursesController.putCourse
);

// DELETE: Xóa khóa học
router.delete(`${prefix}/admin/course`, coursesController.deleteCourse);
module.exports = router;
