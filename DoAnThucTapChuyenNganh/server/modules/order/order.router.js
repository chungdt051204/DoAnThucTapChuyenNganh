const express = require("express");
const router = express.Router();
const controller = require("./order.controller");

// GET /orders - trả về danh sách tất cả đơn hàng
router.get("/orders", controller.getAllOrders);

module.exports = router;
