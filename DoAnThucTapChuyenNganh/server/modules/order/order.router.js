const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const prefix = "";
router.post(`${prefix}/order`, orderController.postOrder);
router.get(`${prefix}/orders`, orderController.getOrders);
module.exports = router;
