const express = require("express");
const router = express.Router();
const enrollmentController = require("./enrollment.controller");
const prefix = "";
router.get(`${prefix}/enrollment`, enrollmentController.getEnrollment);
router.post(`${prefix}/enrollment`, enrollmentController.postEnrollment);
module.exports = router;
