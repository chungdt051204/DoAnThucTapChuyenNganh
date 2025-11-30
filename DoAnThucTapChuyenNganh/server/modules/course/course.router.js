const express = require("express"); // import thư viện express

const router = express.Router(); // tạo router để định nghĩa các router con

const coursesController = require("./course.controller"); // import controller xử lý logic cho từng API

const prefix = "";
router.get(`${prefix}/courses`, coursesController.getCourses);
router.get(`${prefix}/course-free`, coursesController.getCoursesFree);
router.get(`${prefix}/course-pre`, coursesController.getCoursesPre);
router.get(`${prefix}/course/detail`, coursesController.getDetailCourse);
router.get(
  `${prefix}/courses/category`,
  coursesController.getCoursesWithCategory_Id
);
router.get(
  `${prefix}/courses/search/suggestion`,
  coursesController.getCoursesWithSearchSuggestion
);
module.exports = router;
