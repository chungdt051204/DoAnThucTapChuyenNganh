const express = require("express"); //Import thư viện express
const router = express.Router();
const categoryController = require("./category.controller");
const prefix = "";
router.get(`${prefix}/categories`, categoryController.getAllCategories);
router.post(`${prefix}/category`, categoryController.postCategory);
router.get(`${prefix}/category`, categoryController.getCategoryWithId);
router.put(`${prefix}/category`, categoryController.putCategory);
router.delete(`${prefix}/category`, categoryController.deleteCategory);
module.exports = router;
