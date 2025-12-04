const express = require("express"); //Import thư viện express
const router = express.Router();
const coursesController = require("./course.controller");
const multer = require("multer"); //Import thư viện multer
const prefix = "";

//Lưu trữ ảnh khóa học vào thư mục public/images/course bằng multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images/course/");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get(`${prefix}/courses`, coursesController.getCourses);
router.get(`${prefix}/course-free`, coursesController.getCoursesFree);
router.get(`${prefix}/course-pre`, coursesController.getCoursesPre);
router.get(`${prefix}/course`, coursesController.getDetailCourse);

router.get(
  `${prefix}/courses/search/suggestion`,
  coursesController.getCoursesWithSearchSuggestion
);
router.post(
  `${prefix}/admin/course`,
  upload.single("image"),
  coursesController.postAddCourse
);
router.put(
  `${prefix}/admin/course`,
  upload.fields([{ name: "image" }, { name: "thumbnail" }]),
  coursesController.putUpdateCourse
);
router.delete(`${prefix}/admin/course`, coursesController.deleteCourse);
router.get(`${prefix}/course`, coursesController.getCourseWithId);
module.exports = router;
