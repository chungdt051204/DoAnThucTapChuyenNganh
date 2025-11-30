const express = require("express"); // import thư viện express
const router = express.Router(); // tạo router để định nghĩa các router con
const categoryController = require("./category.controller"); // import controller xử lý logic cho từng API
const prefix = "";
router.get(`${prefix}/categories`, categoryController.getAllCategories);
router.post(`${prefix}/category`, categoryController.postCategory);
router.get(`${prefix}/category`, categoryController.getCategoryWithId);
router.put(`${prefix}/category`, categoryController.putCategory);
router.delete(`${prefix}/category`, categoryController.deleteCategory);
module.exports = router;
