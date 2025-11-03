const express = require("express");
const router = express.Router();
const coursesController = require("./courses.controller");
const prefix = "";
router.get(`${prefix}/courses`, coursesController.getCourses);
module.exports = router;
