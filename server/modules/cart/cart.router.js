const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
const prefix = "";
router.post(`${prefix}/cart`, cartController.postCart);
router.get(`${prefix}/cart`, cartController.getCartItem);
router.delete(`${prefix}/cart`, cartController.deleteCartItem);
module.exports = router;
