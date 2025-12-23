const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const prefix = "";
router.post(`${prefix}/order`, orderController.postOrder);
router.get(`${prefix}/order`, orderController.getOrders);
router.get(`${prefix}/daily-revenue`, orderController.getDailyRevenue);
router.get(
  `${prefix}/best-seller-courses`,
  orderController.getBestSellerCourses
);
module.exports = router;
