const express = require("express");
const router = express.Router();
const coursesController = require("./course.controller");
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
