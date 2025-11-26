const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const prefix = "";
router.post(`${prefix}/login`, userController.postLogin);
router.get(`${prefix}/me`, userController.getUser);
router.delete(`${prefix}/me`, userController.logout);
router.get(`${prefix}/instructors`, userController.getInstructors);
module.exports = router;
