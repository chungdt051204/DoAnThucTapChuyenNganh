const express = require("express");
const router = express.Router();
const coursesController = require("./courses.controller");
const prefix = "";
router.get(`${prefix}/courses`, coursesController.getCourses);
router.get(`${prefix}/course-free`, coursesController.getCoursesFree);
router.get(`${prefix}/course-pre`, coursesController.getCoursesPre);
module.exports = router;
