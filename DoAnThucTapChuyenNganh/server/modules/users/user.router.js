const express = require("express");
const router = express.Router();
const userController = require("./users.controller");
const prefix = "";
router.post(`${prefix}/login`, userController.postLogin);
router.get(`${prefix}/me`, userController.getUser);
router.delete(`${prefix}/me`, userController.logout);
module.exports = router;
