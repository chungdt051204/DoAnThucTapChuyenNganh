const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const prefix = "";
router.get(`${prefix}/categories`, categoryController.getCategories);
module.exports = router;
